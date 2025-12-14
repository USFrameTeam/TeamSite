import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """应用配置类"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    # GitHub OAuth配置
    GITHUB_CLIENT_ID = os.environ.get('GITHUB_CLIENT_ID') or ''
    GITHUB_CLIENT_SECRET = os.environ.get('GITHUB_CLIENT_SECRET') or ''
    GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize'
    GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token'
    GITHUB_USER_API = 'https://api.github.com/user'
    GITHUB_USER_ORGS_API = 'https://api.github.com/user/orgs'
    
    # 调试配置
    DEBUG = os.environ.get('DEBUG', 'False').lower() == 'false'  # 默认为True以便开发
    
    # 权限配置 - 分层权限系统
    # 所有GitHub用户都可以登录（为反馈功能做准备）
    # 只有特定用户才有管理权限
    
    # 允许的GitHub组织（团队成员）
    ALLOWED_ORGANIZATIONS = os.environ.get('ALLOWED_ORGANIZATIONS', 'USFrameTeam').split(',') if os.environ.get('ALLOWED_ORGANIZATIONS') else ['USFrameTeam']
    
    # 特殊用户列表（具有管理权限的用户）
    SPECIAL_USERS = os.environ.get('SPECIAL_USERS', 'dyf189').split(',') if os.environ.get('SPECIAL_USERS') else ['dyf189']
    
    # 权限定义
    PERMISSIONS = {
        'Feedback': '反馈权限',  # 所有登录用户都有此权限
        'ManageDownloadSite': '上传文件到下载页面,管理下载页面',  # 团队成员和特殊用户
        'ManageArticle': '修改管理文章'  # 团队成员和特殊用户
    }
    
    # 权限分配
    PERMISSION_MAPPING = {
        'Feedback': ['*'],  # 所有登录用户
        'ManageDownloadSite': ['USFrameTeam', 'SPECIAL_USERS'],  # 团队成员和特殊用户
        'ManageArticle': ['USFrameTeam', 'SPECIAL_USERS']  # 团队成员和特殊用户
    }
    
    @classmethod
    def validate_config(cls):
        """验证配置是否完整"""
        missing = []
        if not cls.GITHUB_CLIENT_ID:
            missing.append('GITHUB_CLIENT_ID')
        if not cls.GITHUB_CLIENT_SECRET:
            missing.append('GITHUB_CLIENT_SECRET')
        
        if missing:
            raise ValueError(f"缺少必要的环境变量: {', '.join(missing)}")
    
    @classmethod
    def get_auth_info(cls):
        """获取认证配置信息（用于调试）"""
        return {
            'allowed_organizations': cls.ALLOWED_ORGANIZATIONS,
            'special_users': cls.SPECIAL_USERS,
            'permissions': cls.PERMISSIONS,
            'organizations_count': len(cls.ALLOWED_ORGANIZATIONS),
            'special_users_count': len(cls.SPECIAL_USERS)
        }
    
    @classmethod
    def check_permission(cls, user_login, user_organizations, permission_name):
        """检查用户是否具有特定权限"""
        if permission_name not in cls.PERMISSIONS:
            return False
        
        permission_requirements = cls.PERMISSION_MAPPING.get(permission_name, [])
        
        for requirement in permission_requirements:
            if requirement == '*':
                # 所有登录用户都有此权限
                return True
            elif requirement == 'USFrameTeam' and 'USFrameTeam' in user_organizations:
                # 用户是USFrameTeam成员
                return True
            elif requirement == 'SPECIAL_USERS' and user_login in cls.SPECIAL_USERS:
                # 用户是特殊用户
                return True
        
        return False