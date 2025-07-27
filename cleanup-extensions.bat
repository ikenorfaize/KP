@echo off
echo Menghapus extensions VS Code yang tidak diperlukan...
echo.

REM Alpine.js (tidak dipakai di React)
code --uninstall-extension adrianwilczynski.alpine-js-intellisense
code --uninstall-extension sperovita.alpinejs-syntax-highlight

REM Database extensions (bisa diinstall lagi jika diperlukan)
echo Menghapus database extensions...
code --uninstall-extension cweijan.dbclient-jdbc
code --uninstall-extension cweijan.vscode-mysql-client2
code --uninstall-extension formulahendry.vscode-mysql
code --uninstall-extension mongodb.mongodb-vscode
code --uninstall-extension mtxr.sqltools
code --uninstall-extension mtxr.sqltools-driver-mysql

REM Remote/Container extensions (untuk development lokal tidak perlu)
echo Menghapus remote/container extensions...
code --uninstall-extension ms-vscode-remote.remote-containers
code --uninstall-extension ms-vscode-remote.remote-ssh
code --uninstall-extension ms-vscode-remote.remote-ssh-edit
code --uninstall-extension ms-vscode-remote.remote-wsl
code --uninstall-extension ms-vscode.remote-explorer

REM Extensions yang jarang dipakai
echo Menghapus extensions lainnya...
code --uninstall-extension formulahendry.code-runner
code --uninstall-extension ms-vsliveshare.vsliveshare
code --uninstall-extension mechatroner.rainbow-csv
code --uninstall-extension icrawl.discord-vscode
code --uninstall-extension adpyke.codesnap
code --uninstall-extension github.classroom
code --uninstall-extension silasnevstad.gpthelper
code --uninstall-extension google.geminicodeassist

REM Jupyter extensions yang tidak perlu (sisakan yang penting saja)
code --uninstall-extension ms-toolsai.jupyter-keymap
code --uninstall-extension ms-toolsai.vscode-jupyter-cell-tags
code --uninstall-extension ms-toolsai.vscode-jupyter-slideshow

REM Python extensions yang tidak terlalu penting
code --uninstall-extension ms-python.debugpy
code --uninstall-extension ms-python.isort
code --uninstall-extension ms-python.vscode-python-envs

echo.
echo Selesai! Extensions yang tidak diperlukan telah dihapus.
echo Extensions yang dipertahankan:
echo - React/JS: Prettier, Tailwind, Live Server, Copilot
echo - Python/ML: Python, Pylance, Jupyter (core)
echo - C/C++: CMake, CPP Tools
echo - Git: GitLens
echo - UI: Material Icons
echo.
pause
