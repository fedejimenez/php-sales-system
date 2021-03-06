<?php 
  // connect to DB and call User model
  require_once("../config/connection.php");
  require_once("../models/User.php");
  require_once("../models/Client.php");
  require_once("../models/Category.php");
  require_once("../models/Product.php");
  require_once("../models/Purchase.php");
  require_once("../models/Sale.php");
  require_once("../models/Company.php");
  require_once("../models/Supplier.php");

  // create user object
  $users = new User();

  // declare variables, are gonna be sent through a form by ajax
  $id_user = isset($_POST["id_user"]);
  $name = isset($_POST["name"]);
  $lastname = isset($_POST["lastname"]);
  $idnumber = isset($_POST["idnumber"]);
  $phone = isset($_POST["phone"]);
  $email = isset($_POST["email"]);
  $address = isset($_POST["address"]);
  $role = isset($_POST["role"]);
  $user = isset($_POST["user"]);
  $password = isset($_POST["password"]);
  $password2 = isset($_POST["password2"]);
  $status = isset($_POST["status"]);

  switch ($_GET["op"]) {
    case 'saveandedit':
      // validation idnumber and email uniques
      $data = $users->get_id_email_user($_POST["idnumber"], $_POST["email"]);

      // validation password matching
      if($password == $password2) {
        if(empty($_POST["id_user"])){
          if(is_array($data)==true and count($data)==0){
            $users->create_user($name, $lastname, $idnumber, $phone, $email, $address, $role, $user, $password, $password2, $status, $permissions);

            $messages[] = "User succsessfully created!";
          }else{
            $errors[] = "User id or email already exists.";
          }
        } else {
          if(is_array($data)==true and count($data)==1){
            $users->edit_user($id_user, $name, $lastname, $idnumber, $phone, $email, $address, $role, $user, $password, $password2, $status, $permissions);
            $messages[] = "User succsessfully updated!";
          } else{
            $errors[] = "User id or email already exists.";
          }
        }

      } else {
        $errors[] = "Passwords doesn't match.";
      }

      // custom success message
     if(isset($messages)){
        ?>
          <div class="alert alert-success" role="alert">
              <button type="button" class="close" data-dismiss="alert">&times;</button>
              <strong>Yay!</strong>
              <?php
                foreach($messages as $message) {
                    echo $message;
                  }
                ?>
          </div>
        <?php
      }

      // custom error message
      if(isset($errors)){
        ?>
          <div class="alert alert-danger" role="alert">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
              <strong>Ooops!</strong> 
              <?php
                foreach($errors as $error) {
                    echo $error;
                  }
                ?>
          </div>
        <?php
      }

    break;
    
    case 'show':

      $data = $users->get_user_by_id($_POST["id_user"]);

      // validation user_id  
      if(is_array($data)==true and count($data)>0){
        foreach($data as $row){
          $output["idnumber"] = $row["idnumber"];
          $output["name"] = $row["name"];
          $output["lastname"] = $row["lastname"];
          $output["role"] = $row["role"];
          $output["user"] = $row["user"];
          $output["password"] = $row["password"];
          $output["password2"] = $row["password2"];
          $output["phone"] = $row["phone"];
          $output["email"] = $row["email"];
          $output["address"] = $row["address"];
          $output["status"] = $row["status"];
        }
         echo json_encode($output);

       } else {
          $errors[]="User doesn't exist";
       }

      // custom error message
      if(isset($errors)){
    
        ?>
        <div class="alert alert-danger" role="alert">
          <button type="button" class="close" data-dismiss="alert">&times;</button>
            <strong>Error!</strong> 
            <?php
              foreach($errors as $error) {
                  echo $error;
                }
              ?>
        </div>
        <?php
      }

      break;
          
    case 'changestatus':
      $data = $users->get_user_by_id($_POST["id_user"]);
        
        //validates user id
         if(is_array($data)==true and count($data)>0){
            
            //edit suser status
            $users->change_status($_POST["id_user"],$_POST["status"]);
         }
      break;
                
    case 'listusers':
      $data = $users->get_users();
      
      $array = Array();

      foreach($data as $row){
        $sub_array= array();
        // STATUS
        $stat = '';
        $attrib = "btn btn-success btn-md status";
        if($row["status"] == 0){
          $stat = 'INACTIVE';
          $attrib = "btn btn-warning btn-md status";
        }
        else{
          if($row["status"] == 1){
            $stat = 'ACTIVE';
            
          } 
        }

        //ROLE
        if($row["role"]==1){
          $role="ADMINISTRATOR";
        } else{
          if($row["role"]==0){
            $role="EMPLOYEE";
          }
        }

        $sub_array[] = $row["idnumber"];
        $sub_array[] = $row["name"];
        $sub_array[] = $row["lastname"];
        $sub_array[] = $row["user"];
        $sub_array[] = $role;
        $sub_array[] = $row["phone"];
        $sub_array[] = $row["email"];
        $sub_array[] = $row["address"];
        $sub_array[] = date("d-m-Y",strtotime($row["start_date"]));
              
        $sub_array[] = '<button type="button" onClick="changeStatus('.$row["id_user"].','.$row["status"].');" name="status" id="'.$row["id_user"].'" class="'.$attrib.'">'.$stat.'</button>';

        $sub_array[] = '<button type="button" onClick="showUser('.$row["id_user"].');"  id="'.$row["id_user"].'" class="btn btn-warning btn-md update"><i class="glyphicon glyphicon-edit"></i> Edit</button>';

        $sub_array[] = '<button type="button" onClick="deleteUser('.$row["id_user"].');"  id="'.$row["id_user"].'" class="btn btn-danger btn-md"><i class="glyphicon glyphicon-edit"></i> Delete</button>';
        
        $array[]=$sub_array;
          
      }

      $results= array( 
        "sEcho"=>1, // data for datatables
        "iTotalRecords"=>count($array), 
        "iTotalDisplayRecords"=>count($array), 
        "aaData"=>$array
      );

      // print_r($results);
      
      echo json_encode($results);
      break;

    case "delete_user":
      $product = new Product();
      $category = new Category();
      $client = new Client();
      $purchase =  new Purchase();
      $company = new Company();
      $supplier = new Supplier();
      $sale = new Sale();
      $product= $product->get_product_by_id_user($_POST["id_user"]);
      $cat= $category->get_category_by_id_user($_POST["id_user"]);
      $cli= $client->get_client_by_id_user($_POST["id_user"]);
      $pur= $purchase->get_purchases_by_id_user($_POST["id_user"]);
      $detail_comp= $purchase->get_detail_purchases_by_id_user($_POST["id_user"]);
      $comp= $company->get_company_by_id_user($_POST["id_user"]);    
      $sup= $supplier->get_supplier_by_id_user($_POST["id_user"]); 
      $sales= $sale->get_sales_by_id_user($_POST["id_user"]);
      $detail_sale= $sale->get_detail_sales_by_id_user($_POST["id_user"]); 
      $user_permission= $users->get_user_permissions_by_id_user($_POST["id_user"]);

      if(
        is_array($product)==true and count($product)>0 or 
        is_array($cat)==true and count($cat)>0 or 
        is_array($cli)==true and count($cli)>0 or 
        is_array($pur)==true and count($pur)>0 or 
        is_array($detail_comp)==true and count($detail_comp)>0 or 
        is_array($comp)==true and count($comp)>0 or 
        is_array($sup)==true and count($sup)>0 or 
        is_array($sales)==true and count($sales)>0 or 
        is_array($detail_sale)==true and count($detail_sale)>0)
      {
        $errors[]="User has associated Products/Sales. Can not be deleted!";
      }
      else{
        $data= $users->get_user_by_id($_POST["id_user"]);
        if(is_array($data)==true and count($data)>0){
          $users->delete_user($_POST["id_user"]);
          $messages[]="User succsessfully deleted!";
        }
      }

      if (isset($messages)){
        ?>
        <div class="alert alert-success" role="alert">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <strong>Yay!</strong>
            <?php
              foreach ($messages as $message) {
                  echo $message;
                }
              ?>
        </div>
        <?php
      }

      if(isset($errors)){
        ?>
        <div class="alert alert-danger" role="alert">
          <button type="button" class="close" data-dismiss="alert">&times;</button>
          <strong>Error!</strong> 
          <?php
            foreach ($errors as $error) {
                echo $error;
              }
          ?>
        </div>
        <?php
      }
    break;
  case 'permissions':
    $list_permissions= $users->permissions();
    $id_user=$_GET['id_user'];
    //echo $id_user;
    $marks = $users->list_permissions_by_user($id_user);
    //print_r($marks);
    $values=array();
    foreach($marks as $re){
      $values[]=$re["id_permission"];
    }
    foreach($list_permissions as $row){
      $output["id_permission"]=$row["id_permission"];
      $output["name"]=$row["name"];
      $sw = in_array($row['id_permission'],$values) ? 'checked':'';
            echo '<li><input type="checkbox" '.$sw.' name="permission[]" value="'.$row["id_permission"].'">'.$row["name"].'</li>';
    }
    break;
  }
?>