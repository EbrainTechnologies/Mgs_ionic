<?php 
require_once('cors.php'); 
$f=fopen('/var/www/html/testfile.txt','a');

$data = json_decode(file_get_contents("php://input"));
fwrite($f,print_r($data,1));

$code='test@email.com';

require_once('cors.php'); 

$res=[];

if($code==$data->email)
{
	$res=(object) ['status'=>false,'message'=>'Email Id already Exist','responsecode'=>'0'];

echo json_encode($res);	
}
else{
$res=(object) ['status'=>true,'message'=>'success'];	
echo json_encode($res);
}





?>