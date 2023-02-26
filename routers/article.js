const express=require('express');
const multer=require('multer');
const router=express.Router();
const ArticleControler=require('../controllers/article')

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./images/articles/')
    },
    filename:function(req,file,cb){
        cb(null,"articulo" + Date.now() + file.originalname);
    }
});

const ups = multer({storage:storage});

router.get("/",(req,res)=>{
    res.send("Bievenido")
})

router.post("/crear",ArticleControler.save);
router.get("/articulos/:ultimos?",ArticleControler.list);
router.get("/articulo/:id",ArticleControler.search);
router.delete("/articulo/:id",ArticleControler.deleting);
router.put("/articulo/:id",ArticleControler.edit);
router.post("/subir-archivo/:id",[ups.single("file0")],ArticleControler.upFile);
router.get("/imagen/:fichero",ArticleControler.image);
router.get("/buscar/:busqueda",ArticleControler.buscador);
module.exports= router;
