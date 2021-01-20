const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images')
  // local que serão salvas as imagens
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now().toString()}-${file.originalname}`)
  }
  // Aqui configuramos qual será a regra para salvar os nomes dos arquivos, então vai receber a data de agora + nome original do arquivo
})

const fileFilter = (req, file, cb) => {
  const isAccepted = ['image/png', 'image/jpg', 'image/jpeg'].find(acceptedFormat => acceptedFormat == file.mimetype)

  if(isAccepted) {
    return cb(null, true);
  }

  return cb(null, false)
}

module.exports = multer ({
  storage,
  fileFilter
})