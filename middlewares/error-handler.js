const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  //customError: Tüm hataları belli bir formatta toplamak için kullanılan bir nesne.
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  };
  //Eğer hata ValidationError ise (örneğin Mongoose doğrulama hatası), kullanıcıya tüm hataları virgülle ayırarak gösterir.
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = 400;
  }
  //Eğer hata kodu 11000 ise, MongoDB'de duplicate key (aynı benzersiz veri tekrar girilmiş) hatasını yakalar.
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = 400;
  }
  //Eğer hata CastError ise, yanlış formatta bir ID girildiğinde (örneğin ObjectId beklenirken düz metin girilirse) devreye girer.
  if (err.name === "CastError") {
    customError.msg = `No item found with id : ${err.value}`;
    customError.statusCode = 404;
  }
  // JSON formatında bir hata  yanıt objesi döner.
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
