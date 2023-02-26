const { validateArticle } = require("../Helpers/valiadate");
const Article = require("../models/Article");
const fs = require("fs");
const path = require('path')
const save = (req, res) => {
  const params = req.body;

  try {
    validateArticle(params);
  } catch (error) {
    return res.status(400).json({
      mensaje: "Error al guardar",
    });
  }

  const article = new Article(params);

  article.save((err, savedArticle) => {
    if (err || !savedArticle) {
      return res.status(400).json({
        mensaje: "No se guardo el articulo",
        Error: err,
      });
    }
    return res.status(200).json({
      estatus: "success",
      articulo: savedArticle,
      mensaje: "Guardado con exito",
    });
  });
};
//------------------------------------------------------------------------------------------
const list = (req, res) => {
  let consult = Article.find({});
  if (req.params.ultimos) {
    consult.limit(3);
  }
  consult.sort({ date: -1 }).exec((err, articles) => {
    if (err || !articles) {
      res.status(404).json({
        mensaje: "No se encontro articulo",
        error: err,
      });
    }
    return res.status(200).json({
      estatus: "success",
      articles,
      contador: articles.length,
    });
  });
};
//------------------------------------------------------------------------------------------

const search = (req, res) => {
  let id = req.params.id;

  Article.findById(id, (err, article) => {
    if (err || !article) {
      res.status(404).json({
        mensaje: "No se encontro articulo",
        error: err,
      });
    }
    return res.status(200).json({
      estatus: "success",
      article,
    });
  });
};
//------------------------------------------------------------------------------------------

const deleting = (req, res) => {
  let id = req.params.id;

  Article.findByIdAndDelete({ _id: id }, (err, articleDeleted) => {
    if (err || !articleDeleted) {
      res.status(500).json({
        mesaje: "no se pudo borrar ",
        error: err,
      });
    }

    res.status(200).json({
      status: "success!",
      mensaje: "Borrado con exito",
      articleDeleted,
    });
  });
};

//------------------------------------------------------------------------------------------

const edit = (req, res) => {
  let id = req.params.id;
  let params = req.body;
  try {
    validateArticle(params);
  } catch (error) {
    return res.status(400).json({
      mensaje: "Error al guardar",
    });
  }

  Article.findByIdAndUpdate(
    { _id: id },
    req.body,
    { new: true },
    (err, articleUpdate) => {
      if (err || !articleUpdate) {
        return res.status(404).json({
          mensaje: "No se encontro articulo",
          error: err,
        });
      }
      return res.status(200).json({
        status: "success!",
        mensaje: "Actualizado",
        articleUpdate,
      });
    }
  );
};

//------------------------------------------------------------------------------------------
const upFile = (req, res) => {
  if (!req.file && !req.files) {
    return res.status(400).json({
      status: "Error",
      mensaje: "Peticion Invalida",
    });
  }

  let file = req.file.originalname;

  let file_split = file.split(".");
  let extension = file_split[1];
  if (
    extension != "jpg" &&
    extension != "jpeg" &&
    extension != "png" &&
    extension != "gif"
  ) {
    fs.unlink(req.file.path, (error) => {
      return res.status(400).json({
        status: "Error",
        mensaje: "Archivo invalido",
      });
    });
  } else {
    // editar el articulo
    let id = req.params.id;

    Article.findByIdAndUpdate(
      { _id: id },
      {img: req.file.filename},
      { new: true },
      (err, articleUpdate) => {
        if (err || !articleUpdate) {
          return res.status(404).json({
            mensaje: "No se encontro articulo",
            error: err,
          });
        }
        return res.status(200).json({
          status: "success!",
          mensaje: "Actualizado",
          articleUpdate,
        });
      }
    );
    
  }
};
//---------------------------------------------------------------------------------

const image= (req,res)=>{
let fichero = req.params.fichero;
let phisicalRoute= "./images/articles/"+fichero

fs.stat(phisicalRoute,(error,existe)=>{
  if(existe){
    return res.sendFile(path.resolve(phisicalRoute));
  }else{
    return res.status(404).json({
      status: "Error",
      mensaje: "El fichero no exite",
      existe,
      fichero,
      phisicalRoute
    });
  }
})

}
//-------------------------------------------------------------------

const buscador =(req,res)=>{
let busqueda= req.params.busqueda;

Article.find({"$or":[
{"title":{"$regex":busqueda,"$options":"i"}},
{"content":{"$regex":busqueda,"$options":"i"}},
]})
.sort({date:-1})
.exec((error,articulosEncontrados)=>{
  if(error || !articulosEncontrados || articulosEncontrados<=0){
    return res.status(400).json({
      status: "Error",
      mensaje:"No se han encontrado articulos"

    })
  }
  return res.status(200).json({
    status:"success!",
    articulosEncontrados
  })
})
}



module.exports = {
  save,
  list,
  search,
  deleting,
  edit,
  upFile,
  image,
  buscador,
};
