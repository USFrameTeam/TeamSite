from flask import Flask, render_template, Blueprint

app = Flask(__name__)

news = Blueprint('news', __name__, template_folder='templates/news', static_folder='templates/news/static')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/news/')
def news_route():
    return render_template('index.html')

@app.route('/eula')
def eula():
    return render_template('eula.html')

@app.route('/about')
def about():
    return render_template('about.html')

#重定向
@app.route('/index.html')
def index_html():
    return render_template('index.html')

@app.route('/eula.html')
def eula_html():
    return render_template('eula.html')

@app.route('/about.html')
def about_html():
    return render_template('about.html')


app.register_blueprint(news, url_prefix='/news/')


if __name__ == '__main__':
    app.run(debug=True)