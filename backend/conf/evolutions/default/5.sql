-- !Ups

alter table gloves
    add glove_image_url VARCHAR(250) null;

alter table gloves
    add glove_box_image_url VARCHAR(250) null;

alter table gloves
    add glove_disposable boolean default 1 not null;



-- !Downs

-- Why'd you want to go back?
