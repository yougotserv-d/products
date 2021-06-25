
DROP TABLE IF EXISTS products;
CREATE  TABLE products (
	id                   SERIAL  NOT NULL ,
	name                 varchar(100)   ,
	slogan               varchar(255)   ,
	description          varchar(510)   ,
	category             varchar(255)   ,
	default_price        money   ,
	CONSTRAINT pk_products_id PRIMARY KEY ( id )
 );

COMMENT ON TABLE products IS 'table for product details';

COMMENT ON COLUMN products.id IS 'unique key';

DROP TABLE IF EXISTS related_products;
CREATE  TABLE related_products (
	id                   SERIAL  NOT NULL ,
	current_product_id   integer   ,
	related_product_id   integer   ,
	CONSTRAINT pk_related_products_id PRIMARY KEY ( id )
 );

DROP TABLE IF EXISTS styles;
CREATE  TABLE styles (
	id                   SERIAL  NOT NULL ,
	product_id           integer   ,
	name                 varchar(100)   ,
	sale_price           money   ,
	original_price       money   ,
	is_default           boolean   ,
	CONSTRAINT pk_styles_id PRIMARY KEY ( id )
 );

DROP TABLE IF EXISTS photos;
CREATE  TABLE photos (
	id                   SERIAL  NOT NULL ,
	style_id             integer   ,
	url                  char(510)   ,
	thumbnail_url        char(765)   ,
	CONSTRAINT pk_photos_id PRIMARY KEY ( id )
 );

DROP TABLE IF EXISTS product_features;
CREATE  TABLE product_features (
	id                   SERIAL  NOT NULL ,
	product_id           integer     ,
	feature              varchar(100)           ,
	value_name           varchar(100)           ,
	CONSTRAINT pk_product_features_id PRIMARY KEY ( id )
 );

DROP TABLE IF EXISTS skus;
CREATE  TABLE skus (
	id                   SERIAL  NOT NULL ,
	style_id             integer   ,
	size_label           varchar(32)   ,
	quantity             integer   ,
	CONSTRAINT pk_skus_id PRIMARY KEY ( id )
 );

ALTER TABLE photos ADD CONSTRAINT fk_photos_photos FOREIGN KEY ( style_id ) REFERENCES styles( id );

ALTER TABLE product_features ADD CONSTRAINT fk_product_features_products FOREIGN KEY ( product_id ) REFERENCES products( id );

ALTER TABLE product_features ADD CONSTRAINT fk_product_featuresproductseatures FOREIGN KEY ( feature_id ) REFERENCES features( id );

ALTER TABLE product_features ADD CONSTRAINT fk_product_features_feature_value FOREIGN KEY ( feature_value ) REFERENCES feature_values( id );

ALTER TABLE related_products ADD CONSTRAINT fk_related_products_products1 FOREIGN KEY ( current_product_id ) REFERENCES products( id );

ALTER TABLE related_products ADD CONSTRAINT fk_related_products_products2 FOREIGN KEY ( related_product_id ) REFERENCES products( id );

ALTER TABLE skus ADD CONSTRAINT fk_skus_styles FOREIGN KEY ( style_id ) REFERENCES styles( id );

ALTER TABLE styles ADD CONSTRAINT fk_styles_products FOREIGN KEY ( product_id ) REFERENCES products( id );

COPY products FROM '/home/alexander/hackreactor/work/yougotserv-d/products/raw data/product.csv' DELIMITER ',' CSV HEADER;

COPY styles FROM '/home/alexander/hackreactor/work/yougotserv-d/products/raw data/styles.csv' DELIMITER ',' CSV HEADER;

COPY skus FROM '/home/alexander/hackreactor/work/yougotserv-d/products/raw data/skus.csv' DELIMITER ',' CSV HEADER;

COPY photos FROM '/home/alexander/hackreactor/work/yougotserv-d/products/raw data/photos.csv' DELIMITER ',' CSV HEADER;

INSERT INTO related_products (id, current_product_id, related_product_id) (SELECT id, current_product_id, related_product_id FROM features_csv);

COPY product_features FROM '/home/alexander/hackreactor/work/yougotserv-d/products/raw data/features.csv' DELIMITER ',' CSV HEADER;
