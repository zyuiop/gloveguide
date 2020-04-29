-- !Ups

create table dilutions
(
    dilution_id int auto_increment
        primary key,
    substance_id int null,
    concentration int null,
    constraint dilution_substances_substance_id_fk
        foreign key (substance_id) references substances (substance_id)
);

create table gloves_manufacturers
(
    gloves_manufacturer_id int auto_increment
        primary key,
    gloves_manufacturer_name varchar(200) not null,
    gloves_manufacturer_website varchar(200) null
);

create table gloves_materials
(
    gloves_material_id int auto_increment
        primary key,
    gloves_material_name varchar(200) not null
);

create table gloves
(
    glove_id int auto_increment
        primary key,
    glove_manufacturer_id int null,
    glove_material_id int null,
    glove_name varchar(200) null,
    glove_reference varchar(200) null,
    glove_length int null,
    glove_thickness decimal(3,3) null,
    glove_standard_type set('A', 'B') null,
    glove_standard_resistance varchar(15) null,
    glove_standard_aql decimal(4,3) null,
    glove_ease_to_wear set('Good', 'Medium', 'Passable', 'Poor') null,
    glove_ease_to_remove set('Good', 'Medium', 'Passable', 'Poor') null,
    glove_recommendations text null,
    glove_ranking int null,
    glove_ranking_category set('Good', 'Medium', 'Passable', 'Poor') null,
    glove_finger_textured tinyint(1) default 0 null,
    glove_powdered tinyint(1) default 0 null,
    glove_vulcanization_agent varchar(250) null,
    constraint gloves_gloves_manufacturers_gloves_manufacturer_id_fk
        foreign key (glove_manufacturer_id) references gloves_manufacturers (gloves_manufacturer_id),
    constraint gloves_gloves_materials_gloves_material_id_fk
        foreign key (glove_material_id) references gloves_materials (gloves_material_id)
);

create index gloves_glove_ranking_index
    on gloves (glove_ranking);

create table gloves_glass_handling
(
    glove_id int not null,
    humidifier char(10) not null,
    glass_handling set('Good', 'Medium', 'Passable', 'Poor') not null,
    leaves_marks tinyint(1) not null,
    primary key (glove_id, humidifier),
    constraint gloves_glass_handling_gloves_glove_id_fk
        foreign key (glove_id) references gloves (glove_id)
);

create index gloves_glass_handling_glove_id_index
    on gloves_glass_handling (glove_id);

create table gloves_materials_types
(
    gloves_material_id int null,
    gloves_material_type set('Butyl', 'Fluoroelastomer', 'Latex', 'Neoprene', 'Nitrile') not null,
    constraint gloves_materials_types_gloves_materials_gloves_material_id_fk
        foreign key (gloves_material_id) references gloves_materials (gloves_material_id)
);

create table gloves_resistance
(
    glove_id int not null,
    dilution_id int not null,
    min_resistance int null,
    max_resistance int null,
    remarks varchar(250) null,
    primary key (glove_id, dilution_id),
    constraint gloves_resistance_dilutions_dilution_id_fk
        foreign key (dilution_id) references dilutions (dilution_id),
    constraint gloves_resistance_gloves_glove_id_fk
        foreign key (glove_id) references gloves (glove_id)
);

create table gloves_traction_resistance
(
    glove_id int not null,
    gloves_traction_resistance_humidifier char(10) not null,
    traction_resistance set('Good', 'Medium', 'Passable', 'Poor') null,
    primary key (glove_id, gloves_traction_resistance_humidifier),
    constraint gloves_traction_resistance_gloves_glove_id_fk
        foreign key (glove_id) references gloves (glove_id)
);

create index gloves_traction_resistance_glove_id_index
    on gloves_traction_resistance (glove_id);


-- !Downs

drop table gloves_glass_handling;

drop table gloves_materials_types;

drop table gloves_resistance;

drop table dilutions;

drop table gloves_traction_resistance;

drop table gloves;

drop table gloves_manufacturers;

drop table gloves_materials;

