CREATE TABLE categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  art_type text NOT NULL,
  color text NOT NULL,
  sort integer NOT NULL DEFAULT 0
);

CREATE TABLE products (
  id text PRIMARY KEY,
  category_id text NOT NULL REFERENCES categories(id),
  name text NOT NULL,
  price integer NOT NULL CHECK (price >= 0),
  old_price integer NOT NULL DEFAULT 0 CHECK (old_price >= 0),
  images jsonb NOT NULL DEFAULT '[]',
  art_type text NOT NULL,
  colors jsonb NOT NULL DEFAULT '[]',
  size_key text NOT NULL,
  material text NOT NULL DEFAULT '',
  made_in text NOT NULL DEFAULT '',
  tag text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  accent text,
  is_new boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX products_category_idx ON products (category_id);

CREATE SEQUENCE order_no_seq START 10001;

CREATE TABLE orders (
  id serial PRIMARY KEY,
  no integer NOT NULL UNIQUE DEFAULT nextval('order_no_seq'),
  token text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  phone text NOT NULL,
  ship text NOT NULL CHECK (ship IN ('delivery', 'pickup')),
  address text NOT NULL DEFAULT '',
  pay text NOT NULL CHECK (pay IN ('cash', 'card')),
  card_type text,
  note text NOT NULL DEFAULT '',
  items_total integer NOT NULL,
  ship_fee integer NOT NULL,
  total integer NOT NULL,
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'confirmed', 'shipping', 'done', 'cancelled')),
  admin_note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER SEQUENCE order_no_seq OWNED BY orders.no;
CREATE INDEX orders_created_idx ON orders (created_at DESC);

CREATE TABLE order_items (
  id serial PRIMARY KEY,
  order_id integer NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  name text NOT NULL,
  color text NOT NULL,
  size text NOT NULL,
  price integer NOT NULL,
  qty integer NOT NULL CHECK (qty BETWEEN 1 AND 10),
  image text
);
CREATE INDEX order_items_order_idx ON order_items (order_id);

CREATE TABLE settings (
  id integer PRIMARY KEY CHECK (id = 1),
  data jsonb NOT NULL
);

CREATE TABLE admin_sessions (
  token_hash text PRIMARY KEY,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
