create table card (
					card_id SERIAL not null,
					card_name VARCHAR(60) not null, 	--card's name
					card_mana INT null,
					card_type_range_id INT null,        -- it represents the direction that the card can be played 
					card_range INT null,
					card_type_cast_id INT null,			-- it represents the conditions needed that the card can be played 
					primary key (card_id)	
);


create table player (
					player_id SERIAL not null,
					player_name VARCHAR(60) not null, 		
					player_tile_id INT null,	
                    player_mana INT null,
                    player_total_mana INT null, -- the total mana changes in the beginning of the players turn so it needs to be stored 
                    player_energy INT null,
                    player_health INT null,
					player_num INT null,
                    player_password VARCHAR (60) null,
					player_room_id INT null,
					primary key (player_id)	
);

create table deck (
					deck_id SERIAL not null,
					deck_player_id INT null,
                    deck_order INT null, 		
					deck_card_id INT null,  	
					deck_card_state_id INT null,  -- represents where the card is (hand , active , deck)
					deck_card_turns INT null,  -- represents the turns 
					deck_card_enable boolean null,  -- represents it the card is able or not 
					primary key (deck_id)	
);

create table room (
					room_id SERIAL not null,
					room_player_id INT not null, 	 	
                    room_full BOOLEAN not null,
					room_num  INT null ,
					room_round_number INT null,
					

					room_player_state_id INT null,


					primary key (room_id)	
);

create table play (
					play_id SERIAL not null,
					play_room_id INT not null, 	 -- which room the play was made in 
					play_round_number VARCHAR(3) not null,	-- the round nº when the play was made
                    play_state_id INT not null, -- the round state when the play was made 
                    play_tp_id INT not null,  -- represents the type of play ( played a card , moved , ended turn )
                    play_card_id INT not null, -- the card used 
                    play_tile_id  INT null , -- represents what tile was the play made too ( in which tile the card was played , in which tile the player moved too )
                    play_player_id INT not null,
					primary key (play_id)	
);

create table tile (
					tile_id SERIAL not null,
					tile_row INT not null, 	--number
					tile_column INT not null,  	--letter 
					primary key (tile_id)	
);

create table battle_states (
					state_id SERIAL not null,
					state_name VARCHAR(60) not null,
					primary key (state_id)	
);

create table type_of_play (
					tp_id SERIAL not null,
					tp_name VARCHAR(60) not null, 	
					primary key (tp_id)	
);

create table card_state(
                    card_state_id SERIAL not null,
                    card_state_name varchar(30) not null,
					primary key (card_state_id)
);

create table type_range (
					type_range_id int not null,
					type_range_name VARCHAR(30) not null, 		--name of type of range's column
					primary key (type_range_id)	
);

create table type_cast (
					type_cast_id SERIAL not null,
					type_cast_name VARCHAR(60) not null,
					primary key (type_cast_id)
);

create table player_effect (
					player_effect_id SERIAL not null,
					player_effect_player_id INT null,
					player_effect_effect_id INT null,
					player_effect_deck_id INT null,
					primary key (player_effect_id)	
);

create table effect (
					effect_id SERIAL not null,
					effect_name VARCHAR(60) not null,
					primary key (effect_id)	
);

-----------------------------------------------------------------------------------------------------------------------------------------------
-- foreign keys
alter table play
add constraint play_fk_room
foreign key (play_room_id) references room(room_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;    

alter table play
add constraint play_fk_battle_states
foreign key (play_state_id) references battle_states(state_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;  

alter table play
add constraint play_fk_type_of_play
foreign key (play_tp_id) references type_of_play(tp_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;  

alter table play
add constraint play_fk_player
foreign key (play_player_id) references player(player_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;  

alter table deck
add constraint deck_fk_player
foreign key (deck_player_id) references player(player_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;  

alter table deck
add constraint deck_fk_card
foreign key (deck_card_id) references card(card_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;  

alter table deck
add constraint deck_fk_card_state
foreign key (deck_card_state_id) references card_state(card_state_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;  
  
alter table player
add constraint player_fk_tile
foreign key (player_tile_id) references tile(tile_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION; 

alter table room
add constraint room_fk_player
foreign key (room_player_id) references player(player_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;  

alter table room
add constraint room_fk_battle_states
foreign key (room_player_state_id) references battle_states(state_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;

/* alter table room
add constraint room_fk_battle_states
foreign key (room_player_state_id) references battle_states(state_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION; */

alter table card
add constraint card_fk_type_range
foreign key (card_type_range_id) references type_range(type_range_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table card
add constraint card_fk_type_cast
foreign key (card_type_cast_id) references type_cast(type_cast_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table player_effect
add constraint player_effect_fk_player
foreign key (player_effect_player_id) references player(player_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;  

alter table player_effect
add constraint player_effect_fk_effect
foreign key (player_effect_effect_id) references effect(effect_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;  

alter table player_effect
add constraint player_effect_fk_deck
foreign key (player_effect_deck_id) references deck(deck_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;  

-------------------------------------------------------------------------------------------------------------------------------------------

insert into battle_states (state_name) values ('Waiting'); 
insert into battle_states (state_name) values ('Attacking');  
insert into battle_states (state_name) values ('Countering');  
insert into battle_states (state_name) values ('Finished'); 
insert into battle_states (state_name) values ('Incomplete'); 


insert into card_state (card_state_name) values ('hand');
insert into card_state (card_state_name) values ('deck');
insert into card_state (card_state_name) values ('active');

insert into effect (effect_name) values ('Slow');
insert into effect (effect_name) values ('Burn');
insert into effect (effect_name) values ('Polymorph');
insert into effect (effect_name) values ('Shield');


insert into tile (tile_row,tile_column) values (1,1);  -- its adding the 81 tiles based on the letter and number(correponding to rows and columns)
insert into tile (tile_row,tile_column) values (1,2);  
insert into tile (tile_row,tile_column) values (1,3);  
insert into tile (tile_row,tile_column) values (1,4);
insert into tile (tile_row,tile_column) values (1,5);  
insert into tile (tile_row,tile_column) values (1,6);  
insert into tile (tile_row,tile_column) values (1,7);  
insert into tile (tile_row,tile_column) values (1,8);  
insert into tile (tile_row,tile_column) values (1,9);  
insert into tile (tile_row,tile_column) values (2,1);  
insert into tile (tile_row,tile_column) values (2,2);  
insert into tile (tile_row,tile_column) values (2,3);  
insert into tile (tile_row,tile_column) values (2,4);
insert into tile (tile_row,tile_column) values (2,5);  
insert into tile (tile_row,tile_column) values (2,6);  
insert into tile (tile_row,tile_column) values (2,7);  
insert into tile (tile_row,tile_column) values (2,8);  
insert into tile (tile_row,tile_column) values (2,9); 
insert into tile (tile_row,tile_column) values (3,1);  
insert into tile (tile_row,tile_column) values (3,2);  
insert into tile (tile_row,tile_column) values (3,3);  
insert into tile (tile_row,tile_column) values (3,4);
insert into tile (tile_row,tile_column) values (3,5);  
insert into tile (tile_row,tile_column) values (3,6);  
insert into tile (tile_row,tile_column) values (3,7);  
insert into tile (tile_row,tile_column) values (3,8);  
insert into tile (tile_row,tile_column) values (3,9); 
insert into tile (tile_row,tile_column) values (4,1);  
insert into tile (tile_row,tile_column) values (4,2);  
insert into tile (tile_row,tile_column) values (4,3);  
insert into tile (tile_row,tile_column) values (4,4);
insert into tile (tile_row,tile_column) values (4,5);  
insert into tile (tile_row,tile_column) values (4,6);  
insert into tile (tile_row,tile_column) values (4,7);  
insert into tile (tile_row,tile_column) values (4,8);  
insert into tile (tile_row,tile_column) values (4,9); 
insert into tile (tile_row,tile_column) values (5,1);  
insert into tile (tile_row,tile_column) values (5,2);  
insert into tile (tile_row,tile_column) values (5,3);  
insert into tile (tile_row,tile_column) values (5,4);
insert into tile (tile_row,tile_column) values (5,5);  
insert into tile (tile_row,tile_column) values (5,6);  
insert into tile (tile_row,tile_column) values (5,7);  
insert into tile (tile_row,tile_column) values (5,8);  
insert into tile (tile_row,tile_column) values (5,9); 
insert into tile (tile_row,tile_column) values (8,1);  
insert into tile (tile_row,tile_column) values (8,2);  
insert into tile (tile_row,tile_column) values (8,3);  
insert into tile (tile_row,tile_column) values (8,4);
insert into tile (tile_row,tile_column) values (8,5);  
insert into tile (tile_row,tile_column) values (8,6);  
insert into tile (tile_row,tile_column) values (8,7);  
insert into tile (tile_row,tile_column) values (8,8);  
insert into tile (tile_row,tile_column) values (8,9); 
insert into tile (tile_row,tile_column) values (7,1);  
insert into tile (tile_row,tile_column) values (7,2);  
insert into tile (tile_row,tile_column) values (7,3);  
insert into tile (tile_row,tile_column) values (7,4);
insert into tile (tile_row,tile_column) values (7,5);  
insert into tile (tile_row,tile_column) values (7,6);  
insert into tile (tile_row,tile_column) values (7,7);  
insert into tile (tile_row,tile_column) values (7,8);  
insert into tile (tile_row,tile_column) values (7,9); 
insert into tile (tile_row,tile_column) values (6,1);  
insert into tile (tile_row,tile_column) values (6,2);  
insert into tile (tile_row,tile_column) values (6,3);  
insert into tile (tile_row,tile_column) values (6,4);
insert into tile (tile_row,tile_column) values (6,5);  
insert into tile (tile_row,tile_column) values (6,6);  
insert into tile (tile_row,tile_column) values (6,7);  
insert into tile (tile_row,tile_column) values (6,8);  
insert into tile (tile_row,tile_column) values (6,9); 
insert into tile (tile_row,tile_column) values (9,1);  
insert into tile (tile_row,tile_column) values (9,2);  
insert into tile (tile_row,tile_column) values (9,3);  
insert into tile (tile_row,tile_column) values (9,4);
insert into tile (tile_row,tile_column) values (9,5);  
insert into tile (tile_row,tile_column) values (9,6);  
insert into tile (tile_row,tile_column) values (9,7);  
insert into tile (tile_row,tile_column) values (9,8);  
insert into tile (tile_row,tile_column) values (9,9); 

insert into player (player_name, player_mana, player_total_mana, player_energy, player_health, player_password, player_num, player_tile_id,player_room_id) 
values ('Player1',4,4,3,18,1,1,40,1);  
insert into player (player_name, player_mana, player_total_mana, player_energy, player_health, player_password, player_num, player_tile_id,player_room_id)
values ('Player2',3,3,3,20,2,2,59,1);  

insert into type_range (type_range_id ,type_range_name ) values(0,'Anywhere') ; 	
insert into type_range (type_range_id ,type_range_name ) values(2,'North and South');	
insert into type_range (type_range_id ,type_range_name ) values(4,'Orthogonal');
insert into type_range (type_range_id ,type_range_name ) values(8,'Orthogonal and Diagonal');	
insert into type_range (type_range_id ,type_range_name ) values(10,'Area');	

insert into type_of_play (tp_name) values ('Draw a Card');  
insert into type_of_play (tp_name) values ('Move');  
insert into type_of_play (tp_name) values ('Play a card ');  
insert into type_of_play (tp_name) values ('Ended Round');  

insert into type_cast (type_cast_name) values ('Normal');
insert into type_cast (type_cast_name) values ('Quick');
insert into type_cast (type_cast_name) values ('Counter');

insert into card (card_name, card_mana, card_type_range_id, card_range, card_type_cast_id) values ('Layla Winifred Help',1,0,0,2);  -- type of range(0) - Anywhere || Range - 0 || type of cast(2) - Quick
insert into card (card_name, card_mana, card_type_range_id, card_range, card_type_cast_id) values ('Barrel Roll',4,8,2,3); -- type of range(8) -Orthogonal and Diagonal|| type of cast(3) - Counter
insert into card (card_name, card_mana, card_type_range_id, card_range, card_type_cast_id) values ('Shot dart',1,8,2,2); -- type of range(4) - Orthogonal || type of cast(2) - Quick
insert into card (card_name, card_mana, card_type_range_id, card_range, card_type_cast_id) values ('Borugham Cobble',4,4,5,1); -- type of range(4) - Orthogonal || type of cast(1) - Normal
insert into card (card_name, card_mana, card_type_range_id, card_range, card_type_cast_id) values ('Thomaz Osric Illusion',4,10,5,3); 
insert into card (card_name, card_mana, card_type_range_id, card_range, card_type_cast_id) values ('Fire Arrow',4,8,5,1); 
insert into card (card_name, card_mana, card_type_range_id, card_range, card_type_cast_id) values ('Rain Song',3,10,5,1); 
insert into card (card_name, card_mana, card_type_range_id, card_range, card_type_cast_id) values ('Ice Arrow',2,8,4,3); 
insert into card (card_name, card_mana, card_type_range_id, card_range, card_type_cast_id) values ('Kazamir`s Order',3,4,3,2); 
insert into card (card_name, card_mana, card_type_range_id, card_range, card_type_cast_id) values ('Shield Up',3,0,0,3); 
insert into card (card_name, card_mana, card_type_range_id, card_range, card_type_cast_id) values ('Osric`s Bow',5,4,5,2); 
insert into card (card_name, card_mana, card_type_range_id, card_range, card_type_cast_id) values ('Layla Winifred Command',4,0,0,2); 
insert into card (card_name, card_mana, card_type_range_id, card_range, card_type_cast_id) values ('Kazamir Blessing',2,0,0,2); 
insert into card (card_name, card_mana, card_type_range_id, card_range, card_type_cast_id) values ('Rissingshire Pebble',2,8,7,1); 
insert into card (card_name, card_mana, card_type_range_id, card_range, card_type_cast_id) values ('Bellbroke Boulder',8,4,3,1); 


insert into room(room_full, room_num, room_player_id, room_round_number, room_player_state_id) values (true,1,1,7,1);
insert into room(room_full, room_num, room_player_id, room_round_number, room_player_state_id) values (true,1,2,7,2);








		
	

