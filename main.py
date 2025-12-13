from flask import Flask, render_template, Blueprint, send_file, abort
import os

app = Flask(__name__)

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


# 添加上下文处理器，为模板提供正确的URL
@app.context_processor
def inject_template_variables():
    def make_url(path):
        """为模板提供URL生成函数"""
        if path.startswith('http://') or path.startswith('https://'):
            return path
        elif path.startswith('/'):
            return path
        else:
            # 处理相对路径
            if path.endswith('.html'):
                return '/' + path
            else:
                return '/' + path + '.html'
    
    return {
        'make_url': make_url,
        'static': lambda filename: '/static/' + filename
    }

if __name__ == '__main__':
    app.run(debug=True)