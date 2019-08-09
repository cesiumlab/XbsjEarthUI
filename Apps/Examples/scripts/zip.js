function base64ToString(base64String) {
    var jsonString = pako.inflate(atob(base64String), { raw: true, to: 'string' });
    return jsonString;
};

function stringToBase64(data) {
    var base64String = btoa(pako.deflate(data, { raw: true, to: 'string', level: 9 }));
    return base64String;
}