export default function () {
    return `
    <!doctype html>
    <html lang='ru'>
        <head>
            <meta charset="utf-8">
            <meta http-equiv='x-ua-compatible' content='ie=edge'>
            <meta name='viewport' content='width=device-width, initial-scale=1'>
            <link rel='stylesheet' type='text/css' href='/public/app.chunk.css'>
            <link rel='shortcut icon' href='/client/images/favicon.png' type='image/png'>
        </head>
        <body>
            <div id='app'></div>
            <script src='/public/vendor.chunk.js' defer='defer'></script>
            <script src='/public/admin.chunk.js' defer='defer'></script>
        </body>
    </html>`;
}
