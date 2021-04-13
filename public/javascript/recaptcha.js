
module.exports.checkHuman = async (req, res, next) => {
    const secret_key = process.env.CAPTHA_API_SECRET_V3;
    const token = req.body.token;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;
    const ret_val = await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}});
    const data = await ret_val.json();

    if (data.score < .5) {
        console.log('BOT DETECTED')
        req.flash('error', 'Bot detected. Please refresh page and retry.')
        res.redirect('/')
    }
    else{
        next();
    }
}
