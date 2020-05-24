-- !Ups

create table glove_material_types
(
    glove_id int not null,
    glove_material_type set('Butyl', 'Fluoroelastomer', 'Latex', 'Neoprene', 'Nitrile') not null,
    constraint glove_material_types_gloves__glove_id_fk
        foreign key (glove_id) references gloves (glove_id)
);

insert into glove_material_types (glove_id, glove_material_type) (
    SELECT g.glove_id, gmt.gloves_material_type FROM gloves g
JOIN gloves_materials gm on g.glove_material_id = gm.gloves_material_id
JOIN gloves_materials_types gmt on gm.gloves_material_id = gmt.gloves_material_id);

alter table gloves drop foreign key gloves_gloves_materials_gloves_material_id_fk;
drop index gloves_gloves_materials_gloves_material_id_fk on gloves;
alter table gloves drop column glove_material_id;

drop table gloves_materials_types;
drop table gloves_materials;

-- !Downs

-- Why'd you want to go back?
