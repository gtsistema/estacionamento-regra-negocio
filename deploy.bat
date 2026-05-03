@echo off
echo Parando container antigo...
docker-compose down

echo Reconstruindo imagem com codigo atualizado...
docker-compose up --build -d

echo.
echo App rodando em: http://localhost:8080
echo Para ver os logs: docker logs mapa-mental
pause
