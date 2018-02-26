var express = require('express');
var router = express.Router();
var passport=require('passport');

var Comments=require("../models/comments");
var User=require("../models/users");
var Orders=require("../models/orders");
var Images=require("../models/images");
var Restaurant=require("../models/restaurants");
var Employee=require("../models/employees");

var bcrypt=require('bcrypt');
var salt=bcrypt.genSaltSync(10);

var jwt = require('jsonwebtoken');
var configJWT = require('../config/auth');

/* POST Crear un Restaurante */
router.post('/addrestaurant',function(req,res,next){

  Restaurant.findEmail(req.body.email,function(error,data){
    if (error){
        res.json(500,error);
    }else{
      if(data!=null){
        //el email ya existe
        res.json(200,"Email no disponible");
      }else{

        var hash=bcrypt.hashSync(req.body.password,salt);
        var restaurantData={
            IdRestaurante:null,
            nombre:req.body.nombre,
            password:hash,
            email:req.body.email,
            horario:req.body.horario,
            descripcion:req.body.descripcion,
            direccion:req.body.direccion,
            telefono:req.body.telefono,
            ciudad:req.body.ciudad,
            aforo:req.body.aforo,
            tipoComida:req.body.tipoComida,
            coordenadas:req.body.coordenadas,
        };

      Restaurant.insert(restaurantData,function(error,data){
          if (error){
              res.json(500,error);
          }else{
            const payload={
              idUsuario: data,
              nick:data.nombre
            };

            var token = jwt.sign(payload,configJWT.secret, {
              expiresIn: "24h" // expira en 24 horas
            });

            var salida={
              idRestaurante:data,
              nombre:req.body.nombre,
              email:req.body.email,
              token:token
            }

            res.json(200,salida);
            }
        })
      }
    }
  });
});

//Login de empleados
router.post('/loginempleado',function(req,res,next){
  // con esta funcion buscamos si el usuario existe ya o no
  Employee.loginEmployee(req.body.nick, function(error, data) {
      if (error){
          res.json(500,error);
      }else{
      // si no devuelve nada, el usuario no existe
        if(data==null){
            res.json(200,"Login incorrecto");
        }else{
          var dbpass=data[0].password;
          var comparepass=bcrypt.compareSync(req.body.password, dbpass);

          if(comparepass==false){
              res.json(200,"Login incorrecto");
          }else{
            const payload={
              idUsuario: data.idEmpleado,
              nick:data.nick
            };

            var token = jwt.sign(payload,configJWT.secret, {
              expiresIn: "24h" // expira en 24 horas
            });

            var salida={
              idEmpleado:data[0].idEmpleado,
              nick:data[0].nick,
              tipoEmpleado:data[0].tipoEmpleado,
              token:token
            }

            res.json(200,salida);
          }
        }
      }
  });
});



//Login del Restaurante
router.post('/loginrestaurant',function(req,res,next){
  // con esta funcion buscamos si el usuario existe ya o no
  Restaurant.findEmail(req.body.email, function(error, data) {
      if (error){
          res.json(500,error);
      }else{
      // si no devuelve nada, el usuario no existe
        if(data==null){
            res.json(200,"Login incorrecto");
        }else{
          var dbpass=data[0].password;
          var comparepass=bcrypt.compareSync(req.body.password, dbpass);

          if(comparepass==false){
              res.json(200,"Login incorrecto");
          }else{
            const payload={
              idUsuario: data.idRestaurante,
              nick:data.nombre
            };

            var token = jwt.sign(payload,configJWT.secret, {
              expiresIn: "24h" // expira en 24 horas
            });

            var salida={
              idRestaurante:data[0].idRestaurante,
              nombre:data[0].nombre,
              email:data[0].email,
              token:token
            }

            res.json(200,salida);
          }
        }
      }
  });
});

//Login del Usuario
router.post('/login',function(req,res,next){
  // con esta funcion buscamos si el usuario existe ya o no
  User.findOneLocal(req.body.nick, function(error, data) {
      if (error){
          res.json(500,error);
      }else{
      // si no devuelve nada, el usuario no existe
        if(data==null){
            res.json(200,"Login incorrecto");
        }else{
          var dbpass=data[0].password;
          var comparepass=bcrypt.compareSync(req.body.password, dbpass);

          if(comparepass==false){
              res.json(200,"Login incorrecto");
          }else{
            const payload={
              idUsuario: data.idUsuario,
              nick:data.nick
            };

            var token = jwt.sign(payload,configJWT.secret, {
              expiresIn: "24h" // expira en 24 horas
            });

            var salida={
              idUsuario:data[0].idUsuario,
              nombre:data[0].nombre,
              email:data[0].email,
              token:token
            }

            res.json(200,salida);
          }
        }
      }
  });
});

//Login del Aministrador
router.post('/loginadmin',function(req,res,next){
  // con esta funcion buscamos si el usuario existe ya o no
  User.findOneLocal(req.body.nick, function(error, data) {
      if (error){
          res.json(500,error);
      }else{
      // si no devuelve nada, el usuario no existe
        if(data==null){
            res.json(200,"Login incorrecto");
        }else{
          var dbpass=data[0].password;
          var comparepass=bcrypt.compareSync(req.body.password, dbpass);

          if(comparepass==false || data[0].idUsuario!=7){
              res.json(200,"Login incorrecto");
          }else{
            const payload={
              idUsuario: data.idUsuario,
              nick:data.nick
            };

            var token = jwt.sign(payload,configJWT.secret, {
              expiresIn: "24h" // expira en 24 horas
            });

            var salida={
              idUsuario:data[0].idUsuario,
              nombre:data[0].nombre,
              email:data[0].email,
              token:token
            }

            res.json(200,salida);
          }
        }
      }
  });
});

/* POST Crear un usuario */
router.post('/adduser',function(req,res,next){

    User.findOneLocal(req.body.nick,function(error,data){
      if (error){
          res.json(500,error);
      }else{
        if(data!=null){
          //el usuario ya existe
          res.json(200,"Nick no disponible");
        }else{

          var passhash=bcrypt.hashSync(req.body.password,salt);

          var userData={
              nick:req.body.nick,
              nombre:req.body.nick,
              password:passhash,
              email:req.body.email
          };


          User.insertLocal(userData,function(error,data){
              if (error){
                  res.json(500,error);
              }else{
                const payload={
                  idUsuario: data,
                  nick:req.body.nick
                };

                var token = jwt.sign(payload,configJWT.secret, {
                  expiresIn: "24h" // expira en 24 horas
                });

                var salida={
                  idUsuario:data,
                  nombre:req.body.nick,
                  email:req.body.email,
                  token:token
                }

                res.json(200,salida);
              }
          })
        }
      }
    });
});

/* GET  Todos los Restaurantes */
router.get('/allrestaurants', function(req, res, next) {

    Restaurant.all(function(error,data){
        if (error){
            res.json(500,error);
        }else{
            res.json(200,data);
        }
    })

});

/**************************************************************/



// formulario modificacion usuario
router.post('/updateprofileuser', function(req,res,next){

    var passhash=bcrypt.hashSync(req.body.password,salt);
    if(req.body.password!=""){
      var userData={
          id:req.user[0].idUsuario,
          password:passhash,
          email:req.body.email
      };
    }else{
      var userData={
          id:req.user[0].idUsuario,
          password:req.body.password,
          email:req.body.email
      };
    }


    User.update(userData,function(error,data){
        if (error){
            res.json(500,error);
        }else{
          res.render('profile.html', {
              user : req.user
          });
        }
    })
});

// formulario modificacion usuario
router.post('/updateprofileuser', function(req,res,next){

    var passhash=bcrypt.hashSync(req.body.password,salt);
    if(req.body.password!=""){
      var userData={
          id:req.user[0].idUsuario,
          password:passhash,
          email:req.body.email
      };
    }else{
      var userData={
          id:req.user[0].idUsuario,
          password:req.body.password,
          email:req.body.email
      };
    }


    User.update(userData,function(error,data){
        if (error){
            res.json(500,error);
        }else{
          res.render('profile.html', {
              user : req.user
          });
        }
    })
});

/****************GOOGLE ROUTES ************************/
router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// el callback despues de que se haya autenticado el usuario de google
router.get('/auth/google/callback',
        passport.authenticate('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
}));

/***************** FACEBOOK ROUTES *************************/

router.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email']}));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect : '/profile',
        failureRedirect : '/'
}));


// ruta middleware para comprobar si un usuario esta logueado
function isLoggedIn(req, res, next) {

    // si el usuario esta autenticado, continua sin problema
    if (req.isAuthenticated())
        return next();

    // si no lo esta redirige a index
    res.redirect('/');
}

/************************************************************************/



/* POST Crear un comentario */
router.post('/comment',function(req,res,next){
    var commentData={
        IdComentario:null,
        contenido:req.body.contenido,
        fecha:req.body.fecha,
        usuarioc:req.body.usuarioc,
        restaurantec:req.body.restaurantec,
    };

    Comments.insert(commentData,function(error,data){
        if (error){
            res.json(500,error);
        }else{
            res.json(200,data);
        }
    })
});

/* DELETE Borrar un comentario */
router.delete("/comments/:id",function(req,res,next){
    Comments.remove(req.params.id,function(error,data){
        if (error){
            res.json(500,error);
        }else{
            res.json(200,data);
        }
    })
});

/* GET pedidos */
router.get('/orders', function(req, res, next) {

    Orders.all(function(error,data){
        if (error){
            res.json(500,error);
        }else{
            res.json(200,data);
        }
    })
});

/* GET pedidos por su Id */
router.get('/orders/:id', function(req, res, next) {

    Orders.findOneById(req.params.id,function(error,data){
        if (error){
            res.json(500,error);
        }else{
            res.json(200,data);
        }
    })
});

/* DELETE Eliminar un pedido */
router.delete('/orders/:id', function(req,res,next){
  Orders.remove(req.params.id,function(error,data){
      if (error){
          res.json(500,error);
      }else{
          res.json(200,data);
      }
  })
});

/* PUT Modificar un pedido */
router.put('/orders/:id', function(req,res,next){
  var OrderData={
      IdPedido:req.params.id,
      reservap:req.body.reservap,
      asignare:req.body.asignare,
      cuentatotal:req.body.cuentatotal,
      mesa:req.body.mesa
  };

  Orders.update(OrderData, function(error,data){
    if (error){
        res.json(500,error);
    }else{
        res.json(200,data);
    }
  })
});

/* GET productos de pedido por tipo de producto */
router.get('/orders/:id/orderproducts/:tipo', function(req, res, next) {

    Orders.findOrderProductsbyType(req.params.id, req.params.tipo,function(error,data){
        if (error){
            res.json(500,error);
        }else{
            res.json(200,data);
        }
    })
});

/* POST Crear un producto de pedido */
router.post('/orders/:id/orderproducts/', function(req,res,next){

    var OrderProductData={
        IdProductoDePedido:null,
        pedidop:req.params.id,
        productop:req.body.productop,
        tipoproducto:req.body.tipoproducto,
        hora:req.body.hora
    };

    Orders.insertOrderProduct(OrderProductData,function(error,data){
        if (error){
            res.json(500,error);
        }else{
            res.json(200,data);
            aux=1;
        }
    })
});



/*CAMBIA ESTADO DE UN PRODUCTO: PREPARAR-PREPARANDO  */
/*:idpp Id de produco de pedido :idp  ID de producto*/
router.put('/orders/:id/orderproducts/:idpp/preparando/:idp', function(req, res, next){

        Orders.CambiaEstadoPP(req.params.id,req.params.idpp,req.params.idp,function(error,data){
            if (error){
                res.json(500,error);
            }else{
                res.json(200,data);
                aux=1;
            }
        })
    });

/*CAMBIA ESTADO DE UN PRODUCTO: PREPARANDO-PREPARADO  */
/*:idpp Id de produco de pedido :idp  ID de producto*/
router.put('/orders/:id/orderproducts/:idpp/preparado/:idp', function(req, res, next){

      Orders.CambiaEstadoPP2(req.params.id,req.params.idpp,req.params.idp,function(error,data){
              if (error){
                    res.json(500,error);
                }else{
                    res.json(200,data);
                    aux=1;
                }
            })
        });
  /*CAMBIA ESTADO DE UN PRODUCTO: PREPARADO-SERVIDO  */
  /*:idpp Id de produco de pedido :idp  ID de producto*/
  router.put('/orders/:id/orderproducts/:idpp/servido/:idp', function(req, res, next){

        Orders.CambiaEstadoPS(req.params.id,req.params.idpp,req.params.idp,function(error,data){
                    if (error){
                        res.json(500,error);
                    }else{
                        res.json(200,data);
                        aux=1;
                    }
                })
            });


/* GET facturas */

router.get('/orders/:idusuario/bill', function(req, res, next){

    Orders.findOrderbyBill(req.params.idusuario,function(error,data){

        if (error){
            res.json(500,error);
        }else{
            res.json(200,data);
        }
    })
});

/* GET facturas por nombre de restaurante */

router.get('/orders/:idusuario/bill/name/:nombre', function(req, res, next){


    Orders.findOrderbyBillbyName(req.params.idusuario,req.params.nombre,function(error,data){

        if (error){
            res.json(500,error);
        }else{
            res.json(200,data);
        }
    })
});

/* GET facturas filtrado por precio */

router.get('/orders/:idusuario/bill/filter/:cuentainicial/:cuentafinal', function(req, res, next){

    Orders.findOrderbyBillFilterPrice(req.params.idusuario,req.params.cuentainicial,req.params.cuentafinal,function(error,data){

        if (error){
            res.json(500,error);
        }else{
            res.json(200,data);
        }
    })
});

/* GET facturas filtrado por precio minimo*/

router.get('/orders/:idusuario/bill/min/:cuenta', function(req, res, next){

    Orders.findOrderbyBillFilterPriceUnder(req.params.idusuario,req.params.cuenta,function(error,data){

        if (error){
            res.json(500,error);
        }else{
            res.json(200,data);
        }
    })
});

/* GET facturas filtrado por precio minimo*/

router.get('/orders/:idusuario/bill/max/:cuenta', function(req, res, next){

    Orders.findOrderbyBillFilterPriceOver(req.params.idusuario,req.params.cuenta,function(error,data){

        if (error){
            res.json(500,error);
        }else{
            res.json(200,data);
        }
    })
});

/* Avisar empleado*/

router.get('/orders/:id/employee/:idempleado', function(req, res, next){

    Orders.OrdersEmployee(req.params.id,req.params.idempleado,function(error,data){

        if (error){
            res.json(500,error);
        }else{
            res.json(200,data);
        }
    })
});




/* Prueba CONEXION */
/*
router.get('/users', function(req, res, next) {
  User.connect(function(error,res){
      if(error){
          console.log(JSON.stringify(error));
      }else{
          console.log(res);
      }
  })
});
*/

module.exports = router;
