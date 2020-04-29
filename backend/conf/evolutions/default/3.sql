-- !Ups

alter table gloves
    add glove_brand VARCHAR(250) null after glove_material_id;

alter table gloves
    drop foreign key gloves_gloves_manufacturers_gloves_manufacturer_id_fk;

update gloves g
    inner join gloves o on o.glove_id = g.glove_id
    inner join gloves_manufacturers gm on gm.gloves_manufacturer_id = o.glove_manufacturer_id
set g.glove_brand = gm.gloves_manufacturer_name;

alter table gloves
    drop column glove_manufacturer_id;

drop table gloves_manufacturers;

-- !Downs

-- Why'd you want to go back?
