
var table;

var table_in_purchases;
var table_in_sales;

function init(){
  listProducts();

  // call modal in purchases and in sales to add products
  listInPurchases();
  listInSales();

  // when clicking submit;
  $("#product_form").on("submit",function(e){
    saveProduct(e);  
  })
    
  // change modal title
  $("#add_button").click(function(){
    $(".modal-title").text("Add Product");
  });
}

function clearProduct(){
  $("#id_product").val("");
  $("#category").val("");
  $('#product').val("");
  $('#package').val("");
  $('#unit').val("");
  $('#currency').val("");
  $('#buying_price').val("");
  $('#sale_price').val("");
  $('#stock').val("");
  $('#status').val("");
  $('#datepicker').val("");
  $('#product_image').val("");
}

function listProducts(){
  table=$('#product_data').dataTable(
  {
    "aProcessing": true,
      "aServerSide": true,
      dom: 'Bfrtip',
      buttons: [              
                'copyHtml5',
                'excelHtml5',
                'csvHtml5',
                'pdf'
            ],
    "ajax":
        {
          url: '../ajax/product.php?op=list',
          type : "get",
          dataType : "json",            
          error: function(e){
            console.log(e.responseText);  
          }
        },
    "bDestroy": true,
    "responsive": true,
    "bInfo":true,
    "iDisplayLength": 10,
      "order": [[ 0, "desc" ]],
      "language": {
          "sProcessing":     "Loading...",
          "sLengthMenu":     "Show _MENU_ registers",
          "sZeroRecords":    "No results found",
          "sEmptyTable":     "No data available",
          "sInfo":           "Showing a total of _TOTAL_ registers",
          "sInfoEmpty":      "Showing a total ff 0 registers",
          "sInfoFiltered":   "(filtered from a total of _MAX_ registers)",
          "sInfoPostFix":    "",
          "sSearch":         "Search:",
          "sUrl":            "",
          "sInfoThousands":  ",",
          "sLoadingRecords": "Loading...",
          "oPaginate": {
              "sFirst":    "First",
              "sLast":     "Last",
              "sNext":     "Next",
              "sPrevious": "Previous"
          },
          "oAria": {
              "sSortAscending":  ": Sort by ascendending order",
              "sSortDescending": ": Sort by descending order"
          }
         }//end language
  }).DataTable();
}

function showProduct(id_product){
  $.post("../ajax/product.php?op=show",{id_product : id_product}, function(data, status){
    data = JSON.parse(data);
    $('#productModal').modal('show');
    $('#category').val(data.category);
    $('#product').val(data.product);
    $('#package').val(data.package);
    $('#unit').val(data.unit);
    $('#currency').val(data.currency);
    $('#buying_price').val(data.buying_price);
    $('#sale_price').val(data.sale_price);
    $('#stock').val(data.stock);
    $('#status').val(data.status);
    $('#datepicker').val(data.expiration_date);
    $('.modal-title').text("Edit Product");
    $('#id_product').val(id_product);
    $('#product_uploaded_image').html(data.product_image);
    $('#results_ajax').html(data);
    $("#product_data").DataTable().ajax.reload();
  });
}

function saveProduct(e){
  e.preventDefault(); 
  var formData = new FormData($("#product_form")[0]);
  $.ajax({
    url: "../ajax/product.php?op=saveandedit",
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,

      success: function(data){                    
        console.log(data);
        $('#product_form')[0].reset();
        $('#productModal').modal('hide');
        $('#results_ajax').html(data);
        $('#product_data').DataTable().ajax.reload();
        
        clearProduct();
      }
    });
}

function changeProductStatus(id_category, id_product, status){
  bootbox.confirm("Are you sure?", function(result){
    if(result){
      $.ajax({
        url:"../ajax/product.php?op=changestatus",
        method:"POST",
        data:{id_category:id_category,id_product:id_product, status:status},
        success: function(data){
          $('#product_data').DataTable().ajax.reload();
        }
      });
    }
  });// endbootbox
}

function listInPurchases(){
  table_in_purchases=$('#list_products_data').dataTable(
  {
    "aProcessing": true,
      "aServerSide": true,
      dom: 'Bfrtip',
      buttons: [              
                'copyHtml5',
                'excelHtml5',
                'csvHtml5',
                'pdf'
            ],
    "ajax":
        {
          url: '../ajax/product.php?op=list_in_purchases',
          type : "get",
          dataType : "json",            
          error: function(e){
            console.log(e.responseText);  
          }
        },
    "bDestroy": true,
    "responsive": true,
    "bInfo":true,
    "iDisplayLength": 10,
      "order": [[ 0, "desc" ]],//Order
      
      "language": {
          "sProcessing":     "Loading...",
          "sLengthMenu":     "Show _MENU_ registers",
          "sZeroRecords":    "No results found",
          "sEmptyTable":     "No data available",
          "sInfo":           "Showing a total of _TOTAL_ registers",
          "sInfoEmpty":      "Showing a total ff 0 registers",
          "sInfoFiltered":   "(filtered from a total of _MAX_ registers)",
          "sInfoPostFix":    "",
          "sSearch":         "Search:",
          "sUrl":            "",
          "sInfoThousands":  ",",
          "sLoadingRecords": "Loading...",
          "oPaginate": {
              "sFirst":    "First",
              "sLast":     "Last",
              "sNext":     "Next",
              "sPrevious": "Previous"
          },
          "oAria": {
              "sSortAscending":  ": Sort by ascendending order",
              "sSortDescending": ": Sort by descending order"
          }
      }//end language
         
  }).DataTable();
}

//========================================================================
//   FUNCTIONS CALLED WHEN ADDING A PRODUCT FROM PURCHASES SECTION 
// ======================================================================
var details = [];
function addDetails(id_product,product, status){

  $.ajax({
          url:"../ajax/product.php?op=search_product",
          method:"POST",
          data:{id_product:id_product, product:product, status:status},
          cache: false,
          dataType:"json",

          success:function(data){
                     console.log(data);
                     if(data.id_product){
                      if (typeof data == "string"){
                        data = $.parseJSON(data);
                      }
            
                      var obj = {
                        quantity : 1,
                        id_product  : id_product,
                        codCat   : data.id_category,
                        product : data.product,
                        currency   : data.currency,
                        price   : data.buying_price,
                        stock    : data.stock,
                        discount    : 0,
                        ammount  : 0,
                        status   : data.status
                      };
                    
                      details.push(obj);
                      listDetails();

                      $('#products_listModal').modal("hide");

                    }//if validacion id_product
                      else {
                           // product is inactive
                            bootbox.alert(data.error);
                    }
          },//end success
          error:function(e){
            console.log(e);
          }    
        });//end de ajax
  }// end function


  function listDetails(){
    $('#listProdPurchase').html('');

    var rows = "";
    var subtotal = 0;
    var total = 0;
    var subtotalFinal = 0;
    var totalFinal = 0;
    var tax = 10;
    var igv = (tax/100);

    for(var i=0; i<details.length; i++){
      if( details[i].status == 1 ){

      var ammount = details[i].ammount = details[i].quantity * details[i].price;
      ammount = details[i].ammount = details[i].ammount - (details[i].ammount * details[i].discount/100);

      var rows = rows + "<tr><td>"+(i+1)+"</td> <td name='product[]'>"+details[i].product+"</td> <td name='price[]' id='price[]'>"+details[i].currency+" "+details[i].price+"</td> <td>"+details[i].stock+"</td> <td><input type='number' class='quantity input-group-sm' name='quantity[]' id='quantity[]' onClick='setQuantity(event, this, "+(i)+");' onKeyUp='setQuantity(event, this, "+(i)+");' value='"+details[i].quantity+"'></td>  <td><input type='number' name='discount[]' id='discount[]' onClick='setDiscount(event, this, "+(i)+");' onKeyUp='setDiscount(event, this, "+(i)+");' value='"+details[i].discount+"'></td> <td> <span name='ammount[]' id='ammount"+i+"'>"+details[i].currency+" "+details[i].ammount+"</span> </td> <td>  <button href='#' class='btn btn-danger btn-lg' role='button' onClick='deleteProduct(event, "+(i)+");' aria-pressed='true'><span class='glyphicon glyphicon-trash'></span> </button></td> </tr>";
      
      subtotal = subtotal + ammount;

      subtotalFinal = details[i].currency+" "+subtotal;

      var su = subtotal*igv;
      var or=parseFloat(su);
      var total= Math.round(or+subtotal);
      totalFinal = details[i].currency+" "+total;
      }
    }
    
    $('#listProdPurchase').html(rows);

    //subtotal
    $('#subtotal').html(subtotalFinal);
    $('#subtotal_purchase').html(subtotalFinal);

    //total
    $('#total').html(totalFinal);
    $('#total_purchase').html(totalFinal);
  }

  function setQuantity(event, obj, idx){
    event.preventDefault();
    details[idx].quantity = parseInt(obj.value);
    recalculate(idx);
  }
  function setDiscount(event, obj, idx){
    event.preventDefault();
    details[idx].discount = parseFloat(obj.value);
    recalculate(idx);
  }
    
  function recalculate(idx){
    console.log(details[idx].quantity);
    console.log((details[idx].quantity * details[idx].price));

    var ammount =details[idx].ammount = details[idx].quantity * details[idx].price;
    ammount = details[idx].ammount = details[idx].ammount - (details[idx].ammount * details[idx].discount/100);
    
    ammountFinal = details[idx].currency+" "+ammount;

    $('#ammount'+idx).html(ammountFinal);
    calculateTotals();
  }

  function calculateTotals(){
   
    var subtotal = 0;
    var total = 0;
    var subtotalFinal = 0;
    var totalFinal = 0;
    var tax = 10;
    var igv = (tax/100);
   
    for(var i=0; i<details.length; i++){
      if(details[i].status == 1){
      subtotal = subtotal + (details[i].quantity * details[i].price) - (details[i].quantity*details[i].price*details[i].discount/100);
        
        subtotalFinal = details[i].currency+" "+subtotal;

        var su = subtotal*igv;
        var or=parseFloat(su);
        var total = Math.round(or+subtotal);

        totalFinal = details[i].currency+" "+total;
    }
  }

  //subtotal
  $('#subtotal').html(subtotalFinal);
  $('#subtotal_purchase').html(subtotalFinal);

  //total
  $('#total').html(totalFinal);
  $('#total_purchase').html(totalFinal);
  }

  function deleteProduct(event, idx){
    event.preventDefault();
    //console.log('ELIMINAR EYTER');
    details[idx].status = 0;
    listDetails();
  }



 function registerPurchase(){
    
  // variables declaration
  var purchase_number = $("#purchase_number").val();
  var idnumber = $("#idnumber").val();
  var corporate_name = $("#corporate_name").val();
  var address = $("#address").val();
  var total = $("#total").html();
  var purchaser = $("#purchaser").html();
  var payment_type = $("#payment_type").val();
  var id_user = $("#id_user").val();
  var id_supplier = $("#id_supplier").val();

  // validation empty fields in form

  if(idnumber!="" && corporate_name!="" && address!="" && payment_type!="" && details!=""){
  
   /*console.log(purchase_number);
   console.log(idnumber);
   console.log(corporate_name);
   console.log(address);
   console.log(datepicker);*/

    $.ajax({
      url:"../ajax/product.php?op=register_purchase",
      method:"POST",
      data:{'arrayPurchase':JSON.stringify(details), 'purchase_number':purchase_number,'idnumber':idnumber,'corporate_name':corporate_name,'address':address,'total':total,'purchaser':purchaser,'payment_type':payment_type,'id_user':id_user,'id_supplier':id_supplier},
      cache: false,
      dataType:"html",
      error:function(x,y,z){
        console.log(x);
        console.log(y);
        console.log(z);
      },
         
      success:function(data){
        console.log(data);

        var idnumber = $("#idnumber").val("");
        var corporate_name = $("#corporate_name").val("");
        var address = $("#address").val("");
        var subtotal = $("#subtotal").html("");
        var total = $("#total").html("");
         
              
        details = [];
        $('#listProdPurchase').html('');
          setTimeout ("bootbox.alert('Purchase successfully registered.');", 100); 
          // reload page
          setTimeout ("explode();", 2000); 
      }, 
      error:function(e){
        console.log(e);
      }

    }); 

   } else{
     bootbox.alert("You must add a product, supplier data and a payment type.");
     return false;
   }  
  }

/*Reload page after registering the purchase*/
function explode(){
  location.reload();
}
// =========== END FUNCTIONS FROM PURCHASES SECTION ===================

//========================================================================
//   FUNCTIONS CALLED WHEN ADDING A PRODUCT FROM SALES SECTION 
// ======================================================================
  
function listInSales(){
  table_in_sales=$('#list_products_sales_data').dataTable({
    "aProcessing": true,
      "aServerSide": true,
      dom: 'Bfrtip',
      buttons: [              
                'copyHtml5',
                'excelHtml5',
                'csvHtml5',
                'pdf'
            ],
    "ajax":
        {
          url: '../ajax/product.php?op=list_in_sales',
          type : "get",
          dataType : "json",            
          error: function(e){
            console.log(e.responseText);  
          }
        },
    "bDestroy": true,
    "responsive": true,
    "bInfo":true,
    "iDisplayLength": 10,
      "order": [[ 0, "desc" ]],//Order
      
      "language": {
          "sProcessing":     "Loading...",
          "sLengthMenu":     "Show _MENU_ registers",
          "sZeroRecords":    "No results found",
          "sEmptyTable":     "No data available",
          "sInfo":           "Showing a total of _TOTAL_ registers",
          "sInfoEmpty":      "Showing a total ff 0 registers",
          "sInfoFiltered":   "(filtered from a total of _MAX_ registers)",
          "sInfoPostFix":    "",
          "sSearch":         "Search:",
          "sUrl":            "",
          "sInfoThousands":  ",",
          "sLoadingRecords": "Loading...",
          "oPaginate": {
              "sFirst":    "First",
              "sLast":     "Last",
              "sNext":     "Next",
              "sPrevious": "Previous"
          },
          "oAria": {
              "sSortAscending":  ": Sort by ascendending order",
              "sSortDescending": ": Sort by descending order"
          }
      }//end language
         
  }).DataTable();
}

var details = [];
   
function addDetailsSales(id_product,product,status){
  $.ajax({
          url:"../ajax/product.php?op=search_product_in_sales",
          method:"POST",
          //data:dataString,
          //toma el valor del id y del status
          data:{id_product:id_product, product:product,status:status},
          cache: false,
          dataType:"json",

          success:function(data){
                    console.log(data);
                    if(data.id_product){
                      if (typeof data == "string"){
                        data = $.parseJSON(data);
                      }
                    
                      var obj = {
                        quantity : 1,
                        id_product  : id_product,
                        product : data.product,
                        currency   : data.currency,
                        price   : data.sale_price,
                        stock    : data.stock,
                        discount    : 0,
                        ammount  : 0,
                        status   : data.status
                      };

                      details.push(obj);
                      // console.log(details);
                      listDetailsSales();
                      $('#list_products_sales_Modal').modal("hide");
                    }//if validacion id_product
                      else {
                            bootbox.alert(data.error); // product is inactive
                    }
          },//end success    
          error: function(e){
            console.log(e);
          }
        });//end  ajax
}// end  funcion

//***********************************************************************

function listDetailsSales(){
  $('#listProdSales').html('');
  var rows = "";
  var subtotal = 0;
  var total = 0;
  var subtotalFinal = 0;
  var totalFinal = 0;
  var tax = 20;
  var igv = (tax/100);

  for(var i=0; i<details.length; i++){
    if(details[i].status == 1){
      var ammount = details[i].ammount = details[i].quantity * details[i].price;
      ammount = details[i].ammount = details[i].ammount - (details[i].ammount * details[i].discount/100);
      
      var rows = rows + "<tr><td>"+(i+1)+"</td> <td name='product[]'>"+details[i].product+"</td> <td name='price[]' id='price[]'>"+details[i].currency+" "+details[i].price+"</td> <td>"+details[i].stock+"</td> <td> <input type='text' class='quantity' name='quantity[]' id=quantity_"+i+" onClick='setQuantity(event, this, "+(i)+");' onKeyUp='setQuantityAjax(event, this, "+(i)+");' value='"+details[i].quantity+"'> </td>  <td><input type='text' name='discount[]' id='discount[]' onClick='setDiscount(event, this, "+(i)+");' onKeyUp='setDiscount(event, this, "+(i)+");' value='"+details[i].discount+"'></td> <td> <span name='ammount[]' id=ammount"+i+">"+details[i].currency+" "+details[i].ammount+"</span> </td> <td>  <button href='#' class='btn btn-danger btn-lg' role='button' onClick='deleteProd(event, "+(i)+");' aria-pressed='true'><span class='glyphicon glyphicon-trash'></span> </button></td>   </tr>";
    
      subtotal = subtotal + ammount;
      subtotalFinal = details[i].currency+" "+subtotal;

      var su = subtotal*igv;
      var or=parseFloat(su);
      var total= Math.round(or+subtotal);
      totalFinal = details[i].currency+" "+total;
    }//end if
  }//end for

  
  $('#listProdSales').html(rows);
  $('#subtotal').html(subtotalFinal);
  $('#subtotal_sale').html(subtotalFinal);

  $('#total').html(totalFinal);
  $('#total_sale').html(totalFinal);

}

function setQuantity(event, obj, idx){
  event.preventDefault();
  details[idx].quantity = parseInt(obj.value);
  recalculate(idx);
}

function setQuantityAjax(event, obj, idx){
  event.preventDefault();
  var id_product = details[idx].id_product;
  var sale_quantity = details[idx].quantity = parseInt(obj.value);
  var stock = details[idx].stock;
      //alert(idx);
      //alert(quantity_sale);
      //alert(id_product);
      //alert(stock);
    
  $.ajax({
         url:"../ajax/sale.php?op=search_quantity_sale",
         method:"POST",
         data:{id_product:id_product, sale_quantity:sale_quantity},
         dataType:"json",

         success:function(data){
              //$("#quantity_"+idx).val(data);
              console.log(data);
              $("#results_sales_ajax").html(data);
              if(sale_quantity=="0" || isNaN(sale_quantity)==true || sale_quantity>stock){
                $("#quantity_"+idx).addClass("red");
                $(".btn_product").removeAttr("data-target");
                $("#btn_send").addClass("hide_button");
              } else {
                  $("#quantity_"+idx).removeClass("red");
                  $(".btn_product").attr({"data-target":"#list_products_sales_Modal"});
                  $("#btn_send").removeClass("hide_button");
              }
         }, 
         error:function(e){
          console.log(e);
         }
       })
  recalculate(idx);
}

function setDiscount(event, obj, idx){
  event.preventDefault();
  details[idx].discount = parseFloat(obj.value);
  recalculate(idx);
}
    
function recalculate(idx){
  //alert('holaaa:::' + obj.value);
  //var asd = document.getElementById('quantity');
  //console.log(details[idx].quantity);
  //details[idx].quantity = parseInt(obj.value);
  console.log(details[idx].quantity);
  console.log((details[idx].quantity * details[idx].price));
  //var objImp = 'ammount'+idx;
  //console.log(objImp);

  var ammount =details[idx].ammount = details[idx].quantity * details[idx].price;
  ammount = details[idx].ammount = details[idx].ammount - (details[idx].ammount * details[idx].discount/100);
   
  ammountFinal = details[idx].currency+" "+ammount;
  $('#ammount'+idx).html(ammountFinal);
  calculateTotals();
}

function calculateTotals(){
  var subtotal = 0;
  var total = 0;
  var subtotalFinal = 0;
  var totalFinal = 0;
  var tax = 10;
  var igv = (tax/100);

for(var i=0; i<details.length; i++){
  if( details[i].status == 1 ){
    subtotal = subtotal + (details[i].quantity * details[i].price) - (details[i].quantity*details[i].price*details[i].discount/100);
  
    subtotalFinal = details[i].currency+" "+subtotal;

    var su = subtotal*igv;
    var or=parseFloat(su);
    var total = Math.round(or+subtotal);

    totalFinal = details[i].currency+" "+total;
  }
}

//subtotal
$('#subtotal').html(subtotalFinal);
$('#subtotal_sale').html(subtotalFinal);

//total
$('#total').html(totalFinal);
$('#total_sale').html(totalFinal);
}


function deleteProduct(event, idx){
  event.preventDefault();
  details[idx].status = 0;

  $("#quantity_"+idx).val(1);

  listDetailsSales();
}

function registerSale(){
    
  var sale_number = $("#sale_number").val();
  var idnumber = $("#idnumber").val();
  var name = $("#name").val();
  var lastname = $("#lastname").val();
  var address = $("#address").val();
  var total = $("#total").html();
  var seller = $("#seller").html();
  var payment_type = $("#payment_type").val();
  var id_user = $("#id_user").val();
  var id_client = $("#id_client").val();

  if(idnumber!="" && name!="" && lastname!="" && address!="" && payment_type!="" && details!=""){
    $.ajax({
      url:"../ajax/product.php?op=register_sale",
      method:"POST",
      data:{'arraySales':JSON.stringify(details), 'sale_number':sale_number,'idnumber':idnumber,'name':name, 'lastname':lastname,'address':address,'total':total,'seller':seller,'payment_type':payment_type,'id_user':id_user,'id_client':id_client},
      cache: false,
      dataType:"html",
      error:function(x,y,z){
        console.log(x);
        console.log(y);
        console.log(z);
      },
      success:function(data){
        console.log(data);
        var idnumber = $("#idnumber").val("");
        var name = $("#name").val("");
        var lastname = $("#lastname").val("");
        var address = $("#address").val("");
        details = [];
        $('#listProdSales').html('');
            
        setTimeout ("bootbox.alert('Sale was succesfully registered!');", 100); 
        setTimeout ("explode();", 2000); 
      }
    }); 
  } else{
     bootbox.alert("You must add a Product, Client details and a Payment Type");
     return false;
  }  
}

//*****************************************************************************

function deleteProduct(id_product){
  bootbox.confirm("Are you sure you want to delete this Product?", function(result){
    if(result){
      $.ajax({
        url:"../ajax/product.php?op=delete_product",
        method:"POST",
        data:{id_product:id_product},

        success:function(data){
          console.log(data);
          $("#results_ajax").html(data);
          $("#product_data").DataTable().ajax.reload();
        }
      });
    }
  });//bootbox
}

init();