exports.onlyRus = value => /^[\dа-яёъ \-+,.?!:;()"_#'\n]+$/i.test(value)

exports.onlyUkr = value => /^[\dабвгґдеєжзиіїйклмнопрстуфхцчшщьюя \-+,.?!:;()"_#'\n]+$/i.test(value)