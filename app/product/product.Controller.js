const jwt = require("jsonwebtoken");
const productModel = require("./product.Model");
const bcrypt = require("bcrypt");
const multer = require("multer");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/product");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}---${file.originalname}`);
  },
});

const upload = multer({ storage: Storage }).fields([
  { name: "coverPicture" },
  { name: "images" },
]);

const productApi = {};

productApi.addProduct = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.log(err);
        res.status(400).send({
          status: false,
          error: err.message,
        });
      } else {
        let arr = [];
        const data = req.body;
        data.coverPicture = req.files.coverPicture[0].path;
       
        req.files.images.map((e) => {
          arr.push({ val: e.path });
        });
        data.images = arr;

        const save = await productModel.create(data);
        if (save) {
          res.status(200).send({
            status: true,
            msg: "product detail added",
          });
        } else {
          res.status(400).send({
            status: true,
            msg: "not added",
          });
        }
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).send({
      status: false,
      err: error.message,
    });
  }
};

productApi.searching = async (req, res) => {
  try {
    const pageNo = parseInt(req.query.pageNo) || 1;
    const pageLimit = parseInt(req.query.pageLimit) || 10;

    let searchFilter = {
      $or: [
        {
          name: {
            $regex: req.query.search ? req.query.search : "",
            $options: "i",
          },
        },
        {
          size: {
            $regex: req.query.search ? req.query.search : "",
            $options: "i",
          },
        },
      ],
    };

    const isExist = await productModel.aggregate([{
        $match:searchFilter
    },{
        $lookup:{
            from:'userdatas',
            let:{id:"$createdby"},
            pipeline:[
                {
                    $match:{
                        $expr:{
                            $eq:["$$id","$_id"]
                        }
                    }
                },{
                  
                    $project:{
                        name:true,
                        role:true
                    }
                  
                }
            ],
            as:"List"
        }
    },{
      $unwind:{
        path:"$List", preserveNullAndEmptyArrays:true
      }
    },{
      $facet:{
        Data:[{$skip:pageLimit*(pageNo-1)},{$limit:pageLimit}],
        Count:[{$count:'count'}]
      }
    }])
  

    if(isExist && isExist.length){
      res.status(200).send({
        status:true,
        Count:isExist[0].Count[0].count,
        Data:isExist[0].Data[0],
        pageNo:pageNo,
        pageLimit:pageLimit
      })
    }
  } catch (error) {
    res.status(400).send({
      status: false,
      err: error.message,
    });
  }
};

module.exports = productApi;
