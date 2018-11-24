<?php
require_once('cors.php'); 
//["title"=>'find players','players_near_you'=>11,'image'=>''],

$b=(object) [];
$b=[
['title'=>'find venue','image'=>'assets/imgs/find-venue.jpg','page'=>'find-venue'],
['title'=>'find ranking','image'=>'assets/imgs/find-ranking.jpg','page'=>'find-ranking'],
['title'=>'upcoming events','image'=>'assets/imgs/upcoming-events.jpg','page'=>'events'],
['title'=>'access deals','image'=>'assets/imgs/access-deals.jpg','page'=>'access-deals'],
['title'=>'featured players','image'=>'assets/imgs/featured-players.jpg','page'=>'featured-players'],
['title'=>'featured clubs','image'=>'assets/imgs/featured-clubs.jpeg','page'=>'featured-clubs'],
['title'=>'update profile','image'=>'assets/imgs/player-profile.jpg','page'=>'update-profile'],
['title'=>'future services','image'=>'assets/imgs/future-services.jpg','page'=>'future-services']
];
$a= ['message'=>'success','token'=>'asdasd3521321asdasd','responsecode'=>'1','username'=>'dinesh','tiles'=>$b];

echo json_encode($a);




?>