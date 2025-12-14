from flask import Flask, render_template, Blueprint, send_file, abort, session, redirect, url_for, request, jsonify
import os
import requests
from config import Config
import ssl
import certifi
from functools import wraps  # 添加wraps导入

app = Flask(__name__)
app.config.from_object(Config)

news = Blueprint('news', __name__, static_folder='templates/news/static')
download = Blueprint('download', __name__, static_folder='templates/download/config')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/news/')
def news_route():
    return render_template('news/index.html')

@app.route('/download/')
def download_route():
    return render_template('download/index.html')

@app.route('/eula')
def eula():
    return render_template('eula.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/news/index.html')
def news_index():
    return render_template('news/index.html')

# 添加文件下载路由
@app.route('/download/files/<path:filename>')
def download_file(filename):
    """提供文件下载服务"""
    try:
        # 构建文件路径
        file_path = os.path.join('templates/download/files', filename)
        
        # 检查文件是否存在
        if not os.path.exists(file_path):
            return "文件不存在", 404
        
        # 设置下载时的文件名
        download_name = os.path.basename(filename)
        
        # 发送文件
        return send_file(file_path, as_attachment=True, download_name=download_name)
    
    except Exception as e:
        return f"下载出错: {str(e)}", 500


@app.route('/<path:filename>')
def serve_html_files(filename):
    """自动处理所有HTML文件的路径映射"""
    # 处理各种路径模式
    template_paths_to_try = []
    
    # 1. 直接路径
    if not filename.endswith('.html'):
        template_paths_to_try.append(filename + '.html')
    else:
        template_paths_to_try.append(filename)
    
    # 2. 文件名（去掉路径部分）
    template_paths_to_try.append(os.path.basename(filename))
    
    # 3. 如果路径包含子目录，尝试不同的组合
    if '/' in filename:
        # 尝试去掉路径前缀
        base_name = os.path.basename(filename)
        if not base_name.endswith('.html'):
            base_name += '.html'
        template_paths_to_try.append(base_name)
        
        # 尝试保持目录结构但去掉.html后缀
        if filename.endswith('.html'):
            template_paths_to_try.append(filename[:-5])  # 去掉.html
    
    # 4. 尝试常见的文件名变体
    if filename.endswith('/index.html'):
        template_paths_to_try.append(filename[:-10])  # 去掉/index.html
        template_paths_to_try.append('index.html')
    
    # 去重
    template_paths_to_try = list(set(template_paths_to_try))
    
    # 尝试所有可能的路径
    for template_path in template_paths_to_try:
        template_full_path = os.path.join('templates', template_path)
        if os.path.exists(template_full_path):
            return render_template(template_path)
    
    # 如果所有路径都找不到，返回404
    abort(404)

app.register_blueprint(news, url_prefix='/news/')
app.register_blueprint(download, url_prefix='/download/')


# 添加认证相关路由
@app.route('/login')
def login():
    """重定向到GitHub OAuth授权页面"""
    # 精确生成回调URL，确保与GitHub OAuth应用中的配置完全匹配
    callback_url = url_for('auth_callback', _external=True)
    github_auth_url = (
        f"{Config.GITHUB_AUTHORIZE_URL}?"
        f"client_id={Config.GITHUB_CLIENT_ID}&"
        f"redirect_uri={callback_url}&"
        f"scope=user:email,read:org"
    )
    return redirect(github_auth_url)

@app.route('/logout')
def logout():
    """用户退出登录"""
    session.clear()
    return redirect(url_for('index'))

@app.route('/auth/callback')
def auth_callback():
    """GitHub OAuth回调处理"""
    code = request.args.get('code')
    if not code:
        return "授权失败：缺少授权码", 400
    
    # 精确生成回调URL，确保与GitHub OAuth应用中的配置完全匹配
    callback_url = url_for('auth_callback', _external=True)
    
    # 获取访问令牌
    token_data = {
        'client_id': Config.GITHUB_CLIENT_ID,
        'client_secret': Config.GITHUB_CLIENT_SECRET,
        'code': code,
        'redirect_uri': callback_url
    }
    
    headers = {'Accept': 'application/json'}
    
    # 尝试多种SSL验证方法
    def make_github_request(url, method='get', data=None, headers=None, verify_attempt=0):
        """处理GitHub API请求，自动处理SSL问题"""
        max_attempts = 3
        verify_options = [
            certifi.where(),  # 方法1：使用certifi证书
            True,            # 方法2：使用系统默认证书
            False            # 方法3：禁用SSL验证（仅开发环境）
        ]
        
        if verify_attempt >= len(verify_options):
            raise requests.exceptions.SSLError("所有SSL验证方法都失败了")
        
        verify = verify_options[verify_attempt]
        
        try:
            if method.lower() == 'post':
                response = requests.post(url, data=data, headers=headers, verify=verify, timeout=30)
            else:
                response = requests.get(url, headers=headers, verify=verify, timeout=30)
            return response
        except requests.exceptions.SSLError as e:
            if verify_attempt < len(verify_options) - 1:
                # 尝试下一种验证方法
                return make_github_request(url, method, data, headers, verify_attempt + 1)
            else:
                raise e
    
    try:
        # 获取访问令牌
        response = make_github_request(
            Config.GITHUB_TOKEN_URL, 
            method='post', 
            data=token_data, 
            headers=headers
        )
        
        if response.status_code != 200:
            return f"获取访问令牌失败: {response.text}", 400
        
        token_info = response.json()
        access_token = token_info.get('access_token')
        
        if not access_token:
            return "获取访问令牌失败", 400
        
        # 获取用户信息
        headers = {
            'Authorization': f'token {access_token}',
            'Accept': 'application/json'
        }
        
        user_response = make_github_request(Config.GITHUB_USER_API, headers=headers)
        if user_response.status_code != 200:
            return "获取用户信息失败", 400
        
        user_info = user_response.json()
        
        # 获取用户组织信息
        orgs_response = make_github_request(Config.GITHUB_USER_ORGS_API, headers=headers)
        user_orgs = orgs_response.json() if orgs_response.status_code == 200 else []
        
        # 检查用户权限
        user_permissions = check_user_permissions(user_info, user_orgs)
        
        # 确保name字段有值，如果GitHub返回的name为null或空，使用login作为显示名称
        display_name = user_info.get('name') or user_info.get('login') or 'GitHub用户'
        if display_name is None or display_name.strip() == '':
            display_name = user_info.get('login', 'GitHub用户')
        
        # 保存用户信息到session
        session['user'] = {
            'id': user_info['id'],
            'login': user_info['login'],
            'name': display_name,
            'email': user_info.get('email', ''),
            'avatar_url': user_info.get('avatar_url', ''),
            'access_token': access_token,
            'organizations': [org['login'] for org in user_orgs],
            'permissions': user_permissions,  # 存储用户权限
            'is_team_member': 'USFrameTeam' in [org['login'] for org in user_orgs],
            'is_special_user': user_info['login'] in Config.SPECIAL_USERS
        }
        
        return redirect(url_for('index'))
    
    except requests.exceptions.SSLError as e:
        # 如果所有SSL验证方法都失败，提供详细错误信息
        error_msg = f"""
        SSL证书验证失败: {str(e)}
        
        可能的解决方案:
        1. 运行以下命令更新系统证书:
           sudo update-ca-certificates (Ubuntu/Debian)
           sudo update-ca-trust (CentOS/RHEL)
        
        2. 手动设置证书路径:
           export SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt
           export REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt
        
        3. 临时解决方案（仅开发环境）:
           编辑main.py，将verify=False添加到所有requests调用中
        """
        return f"<pre>{error_msg}</pre>", 500

def check_user_permissions(user_info, user_orgs):
    """检查用户权限"""
    user_login = user_info['login']
    user_org_names = [org['login'] for org in user_orgs]
    
    permissions = {}
    
    for permission_name in Config.PERMISSIONS.keys():
        has_permission = Config.check_permission(user_login, user_org_names, permission_name)
        permissions[permission_name] = has_permission
    
    return permissions

def has_permission(permission_name):
    """检查当前用户是否具有特定权限"""
    if 'user' not in session:
        return False
    
    user_permissions = session['user'].get('permissions', {})
    return user_permissions.get(permission_name, False)

# 权限验证装饰器
def permission_required(permission_name):
    """权限验证装饰器"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not has_permission(permission_name):
                return "权限不足", 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

@app.route('/api/user')
def get_user_info():
    """获取当前用户信息（API端点）"""
    if 'user' not in session:
        return jsonify({'authenticated': False})
    
    user_data = session['user'].copy()
    # 不返回敏感信息
    user_data.pop('access_token', None)
    
    return jsonify({
        'authenticated': True,
        'user': user_data
    })

@app.route('/api/permissions')
def get_user_permissions():
    """获取当前用户权限信息"""
    if 'user' not in session:
        return jsonify({'authenticated': False})
    
    return jsonify({
        'authenticated': True,
        'permissions': session['user'].get('permissions', {}),
        'is_team_member': session['user'].get('is_team_member', False),
        'is_special_user': session['user'].get('is_special_user', False)
    })

# 示例管理路由（需要特定权限）
@app.route('/admin/download')
@permission_required('ManageDownloadSite')
def admin_download():
    """下载页面管理（需要ManageDownloadSite权限）"""
    return render_template('admin_download.html')

@app.route('/admin/article')
@permission_required('ManageArticle')
def admin_article():
    """文章管理（需要ManageArticle权限）"""
    return render_template('admin_article.html')

@app.route('/feedback')
@permission_required('Feedback')
def feedback():
    """反馈页面（所有登录用户都可以访问）"""
    return render_template('feedback.html')

# 更新上下文处理器，添加权限检查功能
@app.context_processor
def inject_template_variables():
    def make_url(path):
        """为模板提供URL生成函数"""
        if path.startswith('http://') or path.start_from('/'):
            return path
        else:
            # 处理相对路径
            if path.endswith('.html'):
                return '/' + path
            else:
                return '/' + path + '.html'
    
    def has_permission_template(permission_name):
        """模板中使用的权限检查函数"""
        if 'user' not in session:
            return False
        
        user_permissions = session['user'].get('permissions', {})
        return user_permissions.get(permission_name, False)
    
    return {
        'make_url': make_url,
        'static': lambda filename: '/static/' + filename,
        'current_user': session.get('user'),
        'has_permission': has_permission_template  # 修复：使用正确的函数
    }


@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404

if __name__ == '__main__':
    app.run(debug=False)
