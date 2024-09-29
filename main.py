from flask import Flask, request


server = Flask(__name__)
@server.route("/")
def nothin():
    pass
@server.route('/parsePDF', methods=['POST'])
def getBusData():
    print(request.files)
@server.route('/get', methods=['GET'])
def getter():
    return "HERLLO"
server.run()