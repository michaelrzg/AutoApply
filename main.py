from flask import Flask, request
from flask_cors import CORS, cross_origin


server = Flask(__name__)
@server.route("/")
def nothin():
    pass
@server.route('/parsePDF', methods=['POST'])
def getBusData():
    print(request.files)
@server.route('/get', methods=['GET'])
@cross_origin()
def getter():
    return "HERLLO"
CORS(server)
server.run()