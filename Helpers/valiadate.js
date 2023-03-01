const validator = require("validator");

const validateArticle=(params)=>{

    let validateTitle =
    !validator.isEmpty(params.title) &&
    validator.isLength(params.title, { min: 5, max: 25 });
  let validateContent = !validator.isEmpty(params.content);
  if (!validateTitle || !validateContent) {
    throw new Error("no se ha validado la informacion");
  }
  }

  const cambio=(req,res)=>{

  }
  module.exports={
    validateArticle
  }