-- !Ups

create table substances
(
    substance_id int auto_increment,
    substance_name VARCHAR(250) null,
    substance_cas_number VARCHAR(30) null,
    constraint substances_pk
        primary key (substance_id),
    constraint substances_pk_2
        unique (substance_name, substance_cas_number)
);

-- !Downs

drop table substances;