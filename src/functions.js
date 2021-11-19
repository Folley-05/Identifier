const issue=()=>Math.floor((+new Date/1000))

const expiry=()=>Math.floor(((+new Date)/1000))+31536000

exports.issue=issue
exports.expiry=expiry