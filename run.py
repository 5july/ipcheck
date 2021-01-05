# -*- coding: utf-8 -*-


from app import create_app

app = create_app()

if __name__ == "__main__":
    main_dns()
    app.run()
    #main_dns()

@app.shell_context_processor
def make_shell_context():
    return {}

