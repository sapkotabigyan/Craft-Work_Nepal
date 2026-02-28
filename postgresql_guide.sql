-- =============================================================================
-- COMPREHENSIVE POSTGRESQL GUIDE
-- =============================================================================
-- This guide covers essential PostgreSQL operations including:
--   1. Connecting and retrieving the current database name
--   2. Listing all tables in the current database
--   3. Creating a sample database with related tables
--   4. Inserting realistic sample data
--   5. Displaying all records using SELECT statements
--   6. Verifying database name, tables, and inserted data
--
-- Database Theme: KalaBazzer - An Online Handicraft Marketplace
-- =============================================================================


-- =============================================================================
-- SECTION 1: CONNECT TO POSTGRESQL AND RETRIEVE CURRENT DATABASE NAME
-- =============================================================================
-- To connect to PostgreSQL from the command line, use:
--   psql -U <username> -d <database_name> -h <host> -p <port>
-- Example:
--   psql -U postgres -d postgres -h localhost -p 5432
--
-- Once connected, you can retrieve the current database name using:
--   (a) The built-in current_database() function
--   (b) The special variable current_catalog (SQL standard)
--   (c) The \conninfo meta-command in psql (shows connection info)
-- =============================================================================

-- Method 1: Using the built-in current_database() function
SELECT current_database() AS current_database_name;

-- Method 2: Using the SQL standard current_catalog
SELECT current_catalog AS current_database_name;

-- Method 3: Retrieve database name along with current user and server version
SELECT
    current_database()          AS database_name,
    current_user                AS connected_user,
    version()                   AS postgresql_version,
    inet_server_addr()          AS server_address,
    inet_server_port()          AS server_port,
    pg_postmaster_start_time()  AS server_start_time;

-- Method 4: Query the pg_database system catalog for full database details
SELECT
    datname         AS database_name,
    datdba::regrole AS owner,
    pg_encoding_to_char(encoding) AS encoding,
    datcollate      AS collation,
    datctype        AS character_type,
    datistemplate   AS is_template,
    datallowconn    AS allow_connections,
    datconnlimit    AS connection_limit
FROM pg_database
WHERE datname = current_database();


-- =============================================================================
-- SECTION 2: LIST ALL TABLES IN THE CURRENT DATABASE
-- =============================================================================
-- PostgreSQL stores metadata about tables in:
--   (a) information_schema.tables  - SQL standard, portable across databases
--   (b) pg_catalog.pg_tables       - PostgreSQL-specific system catalog
--   (c) pg_catalog.pg_class        - Low-level catalog for all relations
-- =============================================================================

-- Method 1: Using information_schema.tables (SQL standard, recommended)
-- Lists all user-created tables (excludes system schemas)
SELECT
    table_catalog   AS database_name,
    table_schema    AS schema_name,
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
  AND table_type = 'BASE TABLE'
ORDER BY table_schema, table_name;

-- Method 2: Using pg_catalog.pg_tables (PostgreSQL-specific)
SELECT
    schemaname  AS schema_name,
    tablename   AS table_name,
    tableowner  AS owner,
    hasindexes  AS has_indexes,
    hasrules    AS has_rules,
    hastriggers AS has_triggers
FROM pg_catalog.pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY schemaname, tablename;

-- Method 3: List tables with column count and  row estimate
SELECT
    t.table_schema                          AS schema_name,
    t.table_name,
    COUNT(c.column_name)                    AS column_count,
    pg_stat_user_tables.n_live_tup          AS estimated_row_count
FROM information_schema.tables t
JOIN information_schema.columns c
    ON t.table_schema = c.table_schema
   AND t.table_name   = c.table_name
LEFT JOIN pg_stat_user_tables
    ON pg_stat_user_tables.schemaname = t.table_schema
   AND pg_stat_user_tables.relname    = t.table_name
WHERE t.table_schema NOT IN ('pg_catalog', 'information_schema')
  AND t.table_type = 'BASE TABLE'
GROUP BY t.table_schema, t.table_name, pg_stat_user_tables.n_live_tup
ORDER BY t.table_schema, t.table_name;

-- Method 4: List all views in the current database
SELECT
    table_schema    AS schema_name,
    table_name      AS view_name,
    view_definition
FROM information_schema.views
WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
ORDER BY table_schema, table_name;


-- =============================================================================
-- SECTION 3: CREATE SAMPLE DATABASE WITH RELATED TABLE
-- =============================================================================
-- We will create a database named "kalabazzer_db" representing an online
-- handicraft marketplace. The schema includes:
--   - categories        : Product categories (e.g., Pottery, Weaving)
--   - artisans          : Craftspeople who create and sell products
--   - products          : Handicraft items listed for sale
--   - customers         : Registered buyers on the platform
--   - orders            : Purchase orders placed by customers
--   - order_items       : Individual line items within each order
--   - reviews           : Customer reviews for products
--   - inventory         : Stock tracking per product
--
-- NOTE: Run the CREATE DATABASE command from the default "postgres" database.
--       Then connect to "kalabazzer_db" before running the rest of the script.
-- =============================================================================

-- Step 3.1: Create the database
-- Run this from the default postgres database:
-- CREATE DATABASE kalabazzer_db
--     WITH
--     OWNER      = postgres
--     ENCODING   = 'UTF8'
--     LC_COLLATE = 'en_US.UTF-8'
--     LC_CTYPE   = 'en_US.UTF-8'
--     TEMPLATE   = template0
--     CONNECTION LIMIT = -1;

-- COMMENT ON DATABASE kalabazzer_db IS
--     'KalaBazzer - Online Handicraft Marketplace Database';

-- After creating the database, connect to it:
-- \c kalabazzer_db
-- OR via psql: psql -U postgres -d kalabazzer_db

-- =============================================================================
-- Step 3.2: Create a dedicated schema (optional but best practice)
-- =============================================================================

-- Create a dedicated application schema
CREATE SCHEMA IF NOT EXISTS bazzer
    AUTHORIZATION postgres;

COMMENT ON SCHEMA bazzer IS 'KalaBazzer application schema';

-- Set the search path so we don't need to prefix every table
SET search_path TO bazzer, public;

-- =============================================================================
-- Step 3.3: Create ENUM types for controlled vocabulary fields
-- =============================================================================

-- Order status lifecycle
CREATE TYPE bazzer.order_status AS ENUM (
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded'
);

-- Payment method options
CREATE TYPE bazzer.payment_method AS ENUM (
    'cash_on_delivery',
    'esewa',
    'khalti',
    'bank_transfer',
    'credit_card'
);

-- Product condition
CREATE TYPE bazzer.product_condition AS ENUM (
    'new',
    'handmade',
    'vintage',
    'refurbished'
);

-- Review rating scale
CREATE TYPE bazzer.rating_value AS ENUM (
    '1', '2', '3', '4', '5'
);

-- =============================================================================
-- Step 3.4: Create the CATEGORIES table
-- =============================================================================

CREATE TABLE IF NOT EXISTS bazzer.categories (
    category_id     SERIAL          PRIMARY KEY,
    category_name   VARCHAR(100)    NOT NULL UNIQUE,
    slug            VARCHAR(120)    NOT NULL UNIQUE,
    description     TEXT,
    parent_id       INT             REFERENCES bazzer.categories(category_id)
                                        ON DELETE SET NULL,
    image_url       VARCHAR(500),
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    display_order   SMALLINT        NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  bazzer.categories                IS 'Product categories for handicraft items';
COMMENT ON COLUMN bazzer.categories.slug           IS 'URL-friendly version of category_name';
COMMENT ON COLUMN bazzer.categories.parent_id      IS 'Self-referencing FK for nested categories';
COMMENT ON COLUMN bazzer.categories.display_order  IS 'Controls display sequence on the storefront';

-- Index for fast lookup by slug
CREATE INDEX IF NOT EXISTS idx_categories_slug
    ON bazzer.categories(slug);

-- Index for parent-child category traversal
CREATE INDEX IF NOT EXISTS idx_categories_parent_id
    ON bazzer.categories(parent_id);

-- =============================================================================
-- Step 3.5: Create the ARTISANS table
-- =============================================================================

CREATE TABLE IF NOT EXISTS bazzer.artisans (
    artisan_id      SERIAL          PRIMARY KEY,
    first_name      VARCHAR(80)     NOT NULL,
    last_name       VARCHAR(80)     NOT NULL,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    phone           VARCHAR(20),
    bio             TEXT,
    craft_specialty VARCHAR(150),
    city            VARCHAR(100),
    province        VARCHAR(100),
    country         CHAR(2)         NOT NULL DEFAULT 'NP',  -- ISO 3166-1 alpha-2
    profile_image   VARCHAR(500),
    is_verified     BOOLEAN         NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    rating          NUMERIC(3,2)    CHECK (rating BETWEEN 0.00 AND 5.00),
    total_sales     INT             NOT NULL DEFAULT 0 CHECK (total_sales >= 0),
    joined_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  bazzer.artisans                  IS 'Craftspeople who create and sell handicraft products';
COMMENT ON COLUMN bazzer.artisans.country          IS 'ISO 3166-1 alpha-2 country code';
COMMENT ON COLUMN bazzer.artisans.is_verified      IS 'TRUE when artisan identity has been verified by admin';
COMMENT ON COLUMN bazzer.artisans.rating           IS 'Average rating computed from product reviews';

-- Indexes for common search patterns
CREATE INDEX IF NOT EXISTS idx_artisans_email
    ON bazzer.artisans(email);

CREATE INDEX IF NOT EXISTS idx_artisans_city_province
    ON bazzer.artisans(city, province);

CREATE INDEX IF NOT EXISTS idx_artisans_is_active
    ON bazzer.artisans(is_active) WHERE is_active = TRUE;

-- =============================================================================
-- Step 3.6: Create the PRODUCTS table
-- =============================================================================

CREATE TABLE IF NOT EXISTS bazzer.products (
    product_id      SERIAL              PRIMARY KEY,
    artisan_id      INT                 NOT NULL
                                            REFERENCES bazzer.artisans(artisan_id)
                                            ON DELETE RESTRICT,
    category_id     INT                 NOT NULL
                                            REFERENCES bazzer.categories(category_id)
                                            ON DELETE RESTRICT,
    product_name    VARCHAR(200)        NOT NULL,
    slug            VARCHAR(220)        NOT NULL UNIQUE,
    description     TEXT,
    price           NUMERIC(10,2)       NOT NULL CHECK (price > 0),
    discount_pct    NUMERIC(5,2)        NOT NULL DEFAULT 0.00
                                            CHECK (discount_pct BETWEEN 0.00 AND 100.00),
    condition       bazzer.product_condition NOT NULL DEFAULT 'handmade',
    weight_grams    INT                 CHECK (weight_grams > 0),
    dimensions      VARCHAR(80),        -- e.g. "30cm x 20cm x 10cm"
    materials       TEXT,               -- comma-separated list of materials
    is_featured     BOOLEAN             NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN             NOT NULL DEFAULT TRUE,
    view_count      INT                 NOT NULL DEFAULT 0 CHECK (view_count >= 0),
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),

    -- Computed effective price (stored as expression for documentation)
    CONSTRAINT chk_discount_range CHECK (discount_pct BETWEEN 0 AND 100)
);

COMMENT ON TABLE  bazzer.products                  IS 'Handicraft products listed for sale on KalaBazzer';
COMMENT ON COLUMN bazzer.products.slug             IS 'URL-friendly unique identifier for the product';
COMMENT ON COLUMN bazzer.products.discount_pct     IS 'Percentage discount applied to the base price';
COMMENT ON COLUMN bazzer.products.dimensions       IS 'Physical dimensions in human-readable format';

-- Indexes for product discovery
CREATE INDEX IF NOT EXISTS idx_products_artisan_id
    ON bazzer.products(artisan_id);

CREATE INDEX IF NOT EXISTS idx_products_category_id
    ON bazzer.products(category_id);

CREATE INDEX IF NOT EXISTS idx_products_slug
    ON bazzer.products(slug);

CREATE INDEX IF NOT EXISTS idx_products_price
    ON bazzer.products(price);

CREATE INDEX IF NOT EXISTS idx_products_is_active_featured
    ON bazzer.products(is_active, is_featured)
    WHERE is_active = TRUE;

-- Full-text search index on product name and description
CREATE INDEX IF NOT EXISTS idx_products_fts
    ON bazzer.products
    USING GIN (to_tsvector('english', product_name || ' ' || COALESCE(description, '')));

-- =============================================================================
-- Step 3.7: Create the INVENTORY table
-- =============================================================================

CREATE TABLE IF NOT EXISTS bazzer.inventory (
    inventory_id        SERIAL      PRIMARY KEY,
    product_id          INT         NOT NULL UNIQUE
                                        REFERENCES bazzer.products(product_id)
                                        ON DELETE CASCADE,
    quantity_in_stock   INT         NOT NULL DEFAULT 0 CHECK (quantity_in_stock >= 0),
    quantity_reserved   INT         NOT NULL DEFAULT 0 CHECK (quantity_reserved >= 0),
    reorder_level       INT         NOT NULL DEFAULT 5  CHECK (reorder_level >= 0),
    last_restocked_at   TIMESTAMPTZ,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Available stock = in_stock - reserved
    CONSTRAINT chk_reserved_lte_stock
        CHECK (quantity_reserved <= quantity_in_stock)
);

COMMENT ON TABLE  bazzer.inventory                         IS 'Stock levels for each product';
COMMENT ON COLUMN bazzer.inventory.quantity_reserved       IS 'Units reserved by pending/confirmed orders';
COMMENT ON COLUMN bazzer.inventory.reorder_level           IS 'Alert threshold: restock when stock falls below this';

-- =============================================================================
-- Step 3.8: Create the CUSTOMERS table
-- =============================================================================

CREATE TABLE IF NOT EXISTS bazzer.customers (
    customer_id     SERIAL          PRIMARY KEY,
    first_name      VARCHAR(80)     NOT NULL,
    last_name       VARCHAR(80)     NOT NULL,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    phone           VARCHAR(20),
    password_hash   VARCHAR(255)    NOT NULL,
    date_of_birth   DATE,
    gender          CHAR(1)         CHECK (gender IN ('M', 'F', 'O')),
    profile_image   VARCHAR(500),
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    email_verified  BOOLEAN         NOT NULL DEFAULT FALSE,
    total_orders    INT             NOT NULL DEFAULT 0 CHECK (total_orders >= 0),
    registered_at   TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    last_login_at   TIMESTAMPTZ,
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  bazzer.customers                     IS 'Registered buyers on the KalaBazzer platform';
COMMENT ON COLUMN bazzer.customers.password_hash       IS 'bcrypt-hashed password; never store plaintext';
COMMENT ON COLUMN bazzer.customers.gender              IS 'M=Male, F=Female, O=Other/Prefer not to say';

-- Indexes for authentication and search
CREATE INDEX IF NOT EXISTS idx_customers_email
    ON bazzer.customers(email);

CREATE INDEX IF NOT EXISTS idx_customers_is_active
    ON bazzer.customers(is_active) WHERE is_active = TRUE;

-- =============================================================================
-- Step 3.9: Create the CUSTOMER_ADDRESSES table
-- =============================================================================

CREATE TABLE IF NOT EXISTS bazzer.customer_addresses (
    address_id      SERIAL          PRIMARY KEY,
    customer_id     INT             NOT NULL
                                        REFERENCES bazzer.customers(customer_id)
                                        ON DELETE CASCADE,
    label           VARCHAR(50)     NOT NULL DEFAULT 'Home',  -- Home, Work, Other
    street_line1    VARCHAR(200)    NOT NULL,
    street_line2    VARCHAR(200),
    city            VARCHAR(100)    NOT NULL,
    district        VARCHAR(100),
    province        VARCHAR(100),
    postal_code     VARCHAR(20),
    country         CHAR(2)         NOT NULL DEFAULT 'NP',
    is_default      BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  bazzer.customer_addresses            IS 'Shipping/billing addresses for customers';
COMMENT ON COLUMN bazzer.customer_addresses.label      IS 'User-defined label: Home, Work, Other, etc.';
COMMENT ON COLUMN bazzer.customer_addresses.is_default IS 'TRUE for the customer''s primary shipping address';

CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer_id
    ON bazzer.customer_addresses(customer_id);

-- =============================================================================
-- Step 3.10: Create the ORDERS table
-- =============================================================================

CREATE TABLE IF NOT EXISTS bazzer.orders (
    order_id            SERIAL                  PRIMARY KEY,
    customer_id         INT                     NOT NULL
                                                    REFERENCES bazzer.customers(customer_id)
                                                    ON DELETE RESTRICT,
    address_id          INT                     REFERENCES bazzer.customer_addresses(address_id)
                                                    ON DELETE SET NULL,
    order_number        VARCHAR(30)             NOT NULL UNIQUE,
    status              bazzer.order_status     NOT NULL DEFAULT 'pending',
    payment_method      bazzer.payment_method   NOT NULL DEFAULT 'cash_on_delivery',
    payment_status      VARCHAR(30)             NOT NULL DEFAULT 'unpaid'
                                                    CHECK (payment_status IN ('unpaid','paid','refunded','failed')),
    subtotal            NUMERIC(12,2)           NOT NULL CHECK (subtotal >= 0),
    discount_amount     NUMERIC(12,2)           NOT NULL DEFAULT 0.00 CHECK (discount_amount >= 0),
    shipping_fee        NUMERIC(8,2)            NOT NULL DEFAULT 0.00 CHECK (shipping_fee >= 0),
    tax_amount          NUMERIC(8,2)            NOT NULL DEFAULT 0.00 CHECK (tax_amount >= 0),
    total_amount        NUMERIC(12,2)           NOT NULL CHECK (total_amount >= 0),
    notes               TEXT,
    placed_at           TIMESTAMPTZ             NOT NULL DEFAULT NOW(),
    confirmed_at        TIMESTAMPTZ,
    shipped_at          TIMESTAMPTZ,
    delivered_at        TIMESTAMPTZ,
    cancelled_at        TIMESTAMPTZ,
    updated_at          TIMESTAMPTZ             NOT NULL DEFAULT NOW(),

    -- Ensure total_amount = subtotal - discount + shipping + tax
    CONSTRAINT chk_total_amount
        CHECK (
            ABS(total_amount - (subtotal - discount_amount + shipping_fee + tax_amount)) < 0.01
        )
);

COMMENT ON TABLE  bazzer.orders                    IS 'Purchase orders placed by customers';
COMMENT ON COLUMN bazzer.orders.order_number       IS 'Human-readable order reference (e.g. KB-2024-000001)';
COMMENT ON COLUMN bazzer.orders.subtotal           IS 'Sum of (unit_price * quantity) for all order items';
COMMENT ON COLUMN bazzer.orders.discount_amount    IS 'Total discount applied at order level';
COMMENT ON COLUMN bazzer.orders.total_amount       IS 'Final payable amount after all adjustments';

-- Indexes for order management
CREATE INDEX IF NOT EXISTS idx_orders_customer_id
    ON bazzer.orders(customer_id);

CREATE INDEX IF NOT EXISTS idx_orders_order_number
    ON bazzer.orders(order_number);

CREATE INDEX IF NOT EXISTS idx_orders_status
    ON bazzer.orders(status);

CREATE INDEX IF NOT EXISTS idx_orders_placed_at
    ON bazzer.orders(placed_at DESC);

-- =============================================================================
-- Step 3.11: Create the ORDER_ITEMS table
-- =============================================================================

CREATE TABLE IF NOT EXISTS bazzer.order_items (
    order_item_id   SERIAL          PRIMARY KEY,
    order_id        INT             NOT NULL
                                        REFERENCES bazzer.orders(order_id)
                                        ON DELETE CASCADE,
    product_id      INT             NOT NULL
                                        REFERENCES bazzer.products(product_id)
                                        ON DELETE RESTRICT,
    quantity        SMALLINT        NOT NULL CHECK (quantity > 0),
    unit_price      NUMERIC(10,2)   NOT NULL CHECK (unit_price > 0),
    discount_pct    NUMERIC(5,2)    NOT NULL DEFAULT 0.00
                                        CHECK (discount_pct BETWEEN 0 AND 100),
    line_total      NUMERIC(12,2)   NOT NULL CHECK (line_total >= 0),

    -- Prevent duplicate product entries within the same order
    CONSTRAINT uq_order_product UNIQUE (order_id, product_id),

    -- Verify line_total = unit_price * quantity * (1 - discount_pct/100)
    CONSTRAINT chk_line_total
        CHECK (
            ABS(line_total - (unit_price * quantity * (1 - discount_pct / 100.0))) < 0.01
        )
);

COMMENT ON TABLE  bazzer.order_items               IS 'Individual product line items within an order';
COMMENT ON COLUMN bazzer.order_items.unit_price    IS 'Price at time of purchase (snapshot, not live price)';
COMMENT ON COLUMN bazzer.order_items.line_total    IS 'unit_price * quantity * (1 - discount_pct/100)';

CREATE INDEX IF NOT EXISTS idx_order_items_order_id
    ON bazzer.order_items(order_id);

CREATE INDEX IF NOT EXISTS idx_order_items_product_id
    ON bazzer.order_items(product_id);

-- =============================================================================
-- Step 3.12: Create the REVIEWS table
-- =============================================================================

CREATE TABLE IF NOT EXISTS bazzer.reviews (
    review_id       SERIAL              PRIMARY KEY,
    product_id      INT                 NOT NULL
                                            REFERENCES bazzer.products(product_id)
                                            ON DELETE CASCADE,
    customer_id     INT                 NOT NULL
                                            REFERENCES bazzer.customers(customer_id)
                                            ON DELETE CASCADE,
    order_id        INT                 REFERENCES bazzer.orders(order_id)
                                            ON DELETE SET NULL,
    rating          bazzer.rating_value NOT NULL,
    title           VARCHAR(200),
    body            TEXT,
    is_verified     BOOLEAN             NOT NULL DEFAULT FALSE,
    is_published    BOOLEAN             NOT NULL DEFAULT TRUE,
    helpful_votes   INT                 NOT NULL DEFAULT 0 CHECK (helpful_votes >= 0),
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),

    -- One review per customer per product
    CONSTRAINT uq_customer_product_review UNIQUE (customer_id, product_id)
);

COMMENT ON TABLE  bazzer.reviews                   IS 'Customer reviews and ratings for products';
COMMENT ON COLUMN bazzer.reviews.is_verified       IS 'TRUE when reviewer has a confirmed purchase of the product';
COMMENT ON COLUMN bazzer.reviews.helpful_votes     IS 'Number of users who found this review helpful';

CREATE INDEX IF NOT EXISTS idx_reviews_product_id
    ON bazzer.reviews(product_id);

CREATE INDEX IF NOT EXISTS idx_reviews_customer_id
    ON bazzer.reviews(customer_id);

CREATE INDEX IF NOT EXISTS idx_reviews_rating
    ON bazzer.reviews(rating);


-- =============================================================================
-- SECTION 4: INSERT REALISTIC SAMPLE DATA
-- =============================================================================
-- Data is inserted in dependency order to satisfy foreign key constraints:
--   1. categories  (no FK dependencies)
--   2. artisans    (no FK dependencies)
--   3. products    (depends on categories, artisans)
--   4. inventory   (depends on products)
--   5. customers   (no FK dependencies)
--   6. customer_addresses (depends on customers)
--   7. orders      (depends on customers, customer_addresses)
--   8. order_items (depends on orders, products)
--   9. reviews     (depends on products, customers, orders)
-- =============================================================================

-- =============================================================================
-- Step 4.1: Insert CATEGORIES
-- =============================================================================

INSERT INTO bazzer.categories
    (category_name, slug, description, parent_id, display_order)
VALUES
    -- Top-level categories
    ('Pottery & Ceramics',
     'pottery-ceramics',
     'Hand-thrown and hand-built clay vessels, decorative pieces, and functional tableware crafted by skilled potters.',
     NULL, 1),

    ('Textile & Weaving',
     'textile-weaving',
     'Traditional and contemporary woven fabrics, rugs, shawls, and garments made on handlooms.',
     NULL, 2),

    ('Wood Carving',
     'wood-carving',
     'Intricately carved wooden sculptures, furniture accents, frames, and decorative panels.',
     NULL, 3),

    ('Jewelry & Accessories',
     'jewelry-accessories',
     'Handcrafted necklaces, bracelets, earrings, and accessories using silver, beads, and semi-precious stones.',
     NULL, 4),

    ('Painting & Wall Art',
     'painting-wall-art',
     'Original paintings, thangka art, madhubani, and mixed-media wall art by local artists.',
     NULL, 5),

    ('Bamboo & Cane Craft',
     'bamboo-cane-craft',
     'Eco-friendly baskets, furniture, and decorative items woven from bamboo and cane.',
     NULL, 6),

    -- Sub-categories (parent_id references will be resolved by SERIAL values)
    ('Stoneware',
     'stoneware',
     'High-fired stoneware pottery known for durability and earthy aesthetics.',
     1, 1),

    ('Terracotta',
     'terracotta',
     'Traditional unglazed red clay pottery with rustic charm.',
     1, 2),

    ('Pashmina & Cashmere',
     'pashmina-cashmere',
     'Luxurious pashmina shawls and cashmere wraps from the Himalayan region.',
     2, 1),

    ('Dhaka Fabric',
     'dhaka-fabric',
     'Colorful hand-woven Dhaka fabric from eastern Nepal, used in traditional attire.',
     2, 2);

-- =============================================================================
-- Step 4.2: Insert ARTISANS
-- =============================================================================

INSERT INTO bazzer.artisans
    (first_name, last_name, email, phone, bio, craft_specialty,
     city, province, country, is_verified, is_active, rating, total_sales)
VALUES
    ('Sita',
     'Maharjan',
     'sita.maharjan@kalabazzer.np',
     '+977-9841-123456',
     'Third-generation potter from Bhaktapur, specializing in traditional Newari pottery techniques passed down through her family. Her work blends ancient forms with contemporary glazing methods.',
     'Newari Pottery',
     'Bhaktapur', 'Bagmati', 'NP',
     TRUE, TRUE, 4.85, 312),

    ('Ram',
     'Tamang',
     'ram.tamang@kalabazzer.np',
     '+977-9851-234567',
     'Master weaver from Sindhupalchok with over 20 years of experience in traditional Tamang textile patterns. Ram runs a small cooperative employing 15 local weavers.',
     'Traditional Weaving',
     'Chautara', 'Bagmati', 'NP',
     TRUE, TRUE, 4.72, 198),

    ('Kamala',
     'Shrestha',
     'kamala.shrestha@kalabazzer.np',
     '+977-9861-345678',
     'Self-taught wood carver from Patan who creates intricate lattice windows and decorative panels inspired by Newari architecture. Each piece takes weeks to complete.',
     'Newari Wood Carving',
     'Lalitpur', 'Bagmati', 'NP',
     TRUE, TRUE, 4.90, 87),

    ('Bikash',
     'Gurung',
     'bikash.gurung@kalabazzer.np',
     '+977-9801-456789',
     'Jewelry artisan from Pokhara specializing in silver filigree work and turquoise stone settings. Bikash sources all materials ethically from local mines and suppliers.',
     'Silver Jewelry',
     'Pokhara', 'Gandaki', 'NP',
     TRUE, TRUE, 4.68, 445),

    ('Anita',
     'Lama',
     'anita.lama@kalabazzer.np',
     '+977-9841-567890',
     'Thangka painter trained at the Tsering Art School in Boudha. Anita creates traditional Buddhist thangka paintings using natural mineral pigments and 24-karat gold leaf.',
     'Thangka Painting',
     'Kathmandu', 'Bagmati', 'NP',
     TRUE, TRUE, 4.95, 63),

    ('Deepak',
     'Rai',
     'deepak.rai@kalabazzer.np',
     '+977-9851-678901',
     'Bamboo craft specialist from Dharan who creates functional and decorative items using sustainable bamboo harvested from community forests. Deepak also teaches bamboo craft workshops.',
     'Bamboo Craft',
     'Dharan', 'Koshi', 'NP',
     FALSE, TRUE, 4.40, 156);

-- =============================================================================
-- Step 4.3: Insert PRODUCTS
-- =============================================================================

INSERT INTO bazzer.products
    (artisan_id, category_id, product_name, slug, description,
     price, discount_pct, condition, weight_grams, dimensions, materials,
     is_featured, is_active)
VALUES
    -- Pottery products by Sita Maharjan (artisan_id=1)
    (1, 1,
     'Handthrown Newari Water Pot',
     'handthrown-newari-water-pot',
     'A traditional Newari water pot (gagri) hand-thrown on a kick wheel using local red clay. The pot features a narrow neck, wide belly, and a hand-applied terracotta glaze. Perfect for storing drinking water naturally cool.',
     2500.00, 0.00, 'handmade', 1200, '28cm H x 22cm W',
     'Local red clay, terracotta glaze, natural pigments',
     TRUE, TRUE),

    (1, 7,
     'Stoneware Coffee Mug Set (4 pieces)',
     'stoneware-coffee-mug-set-4pc',
     'A set of four hand-thrown stoneware mugs with a speckled ash glaze. Each mug holds 350ml and is microwave and dishwasher safe. Slight variations in glaze make each piece unique.',
     3200.00, 10.00, 'handmade', 1600, '10cm H x 9cm D each',
     'Stoneware clay, ash glaze, food-safe sealant',
     TRUE, TRUE),

    (1, 8,
     'Terracotta Herb Planter Trio',
     'terracotta-herb-planter-trio',
     'Three unglazed terracotta planters of graduated sizes, ideal for growing herbs on a windowsill. Each planter has a drainage hole and matching saucer. The natural clay allows roots to breathe.',
     1800.00, 5.00, 'handmade', 2100, 'Small: 8cm, Medium: 12cm, Large: 16cm diameter',
     'Terracotta clay, natural finish',
     FALSE, TRUE),

    -- Textile products by Ram Tamang (artisan_id=2)
    (2, 9,
     'Pure Pashmina Shawl - Midnight Blue',
     'pure-pashmina-shawl-midnight-blue',
     'A luxuriously soft 100% pure pashmina shawl in a rich midnight blue color. Hand-woven on a traditional loom in Sindhupalchok. The shawl measures 200cm x 70cm and weighs just 120 grams, making it ideal for travel.',
     8500.00, 0.00, 'handmade', 120, '200cm x 70cm',
     '100% pure pashmina (Grade A)',
     TRUE, TRUE),

    (2, 10,
     'Dhaka Fabric Tote Bag',
     'dhaka-fabric-tote-bag',
     'A sturdy tote bag made from authentic hand-woven Dhaka fabric featuring traditional geometric patterns in red, black, and gold. Lined with cotton canvas. Dimensions: 40cm x 35cm with 60cm handles.',
     1200.00, 0.00, 'handmade', 350, '40cm x 35cm, 60cm handles',
     'Hand-woven Dhaka fabric, cotton canvas lining, brass rivets',
     FALSE, TRUE),

    (2, 2,
     'Traditional Dhaka Table Runner',
     'traditional-dhaka-table-runner',
     'A vibrant hand-woven Dhaka table runner featuring intricate geometric motifs in traditional colors. Adds an authentic Nepali touch to any dining table. Machine washable on gentle cycle.',
     950.00, 0.00, 'handmade', 180, '150cm x 35cm',
     'Hand-woven Dhaka cotton fabric',
     FALSE, TRUE),

    -- Wood carving products by Kamala Shrestha (artisan_id=3)
    (3, 3,
     'Newari Lattice Window Panel',
     'newari-lattice-window-panel',
     'A masterfully carved wooden lattice panel (tikijhya) inspired by the traditional windows of Patan Durbar Square. Each panel takes approximately 3 weeks to carve by hand. Can be used as wall art or a room divider.',
     45000.00, 0.00, 'handmade', 8500, '60cm x 90cm x 3cm',
     'Seasoned sal wood, natural teak oil finish',
     TRUE, TRUE),

    (3, 3,
     'Hand-Carved Elephant Bookend Pair',
     'hand-carved-elephant-bookend-pair',
     'A pair of hand-carved wooden elephant bookends with intricate decorative details. Each elephant stands 18cm tall and has a weighted base to hold books securely. Finished with natural beeswax polish.',
     4500.00, 15.00, 'handmade', 2400, '18cm H x 12cm W x 8cm D each',
     'Rosewood, beeswax polish',
     FALSE, TRUE),

    -- Jewelry products by Bikash Gurung (artisan_id=4)
    (4, 4,
     'Silver Filigree Turquoise Pendant Necklace',
     'silver-filigree-turquoise-pendant-necklace',
     'A delicate sterling silver filigree pendant set with a natural turquoise cabochon from Mustang. The pendant hangs on a 45cm sterling silver chain. Each piece is hallmarked 925 and comes in a handmade lokta paper gift box.',
     6800.00, 0.00, 'handmade', 18, 'Pendant: 3.5cm x 2.5cm, Chain: 45cm',
     '925 sterling silver, natural turquoise, lokta paper box',
     TRUE, TRUE),

    (4, 4,
     'Tibetan Prayer Wheel Bracelet',
     'tibetan-prayer-wheel-bracelet',
     'A handcrafted bracelet featuring five miniature spinning prayer wheels in silver, separated by turquoise and coral beads. The prayer wheels spin freely and are engraved with the Om Mani Padme Hum mantra.',
     3500.00, 0.00, 'handmade', 45, 'Adjustable 16-20cm circumference',
     '925 sterling silver, turquoise beads, coral beads',
     FALSE, TRUE),

    -- Painting products by Anita Lama (artisan_id=5)
    (5, 5,
     'Green Tara Thangka Painting',
     'green-tara-thangka-painting',
     'A traditional thangka painting depicting Green Tara, the female bodhisattva of compassion and protection. Painted on cotton canvas using natural mineral pigments and 24-karat gold leaf. Comes mounted on silk brocade.',
     35000.00, 0.00, 'handmade', 400, '45cm x 60cm (painting), 65cm x 90cm (with brocade)',
     'Cotton canvas, natural mineral pigments, 24k gold leaf, silk brocade',
     TRUE, TRUE),

    (5, 5,
     'Mandala Painting on Lokta Paper',
     'mandala-painting-lokta-paper',
     'An intricate hand-painted mandala on handmade lokta paper using acrylic and gold ink. The geometric patterns radiate from a central lotus motif. Suitable for framing. Each piece is signed by the artist.',
     2800.00, 0.00, 'handmade', 80, '50cm x 50cm',
     'Handmade lokta paper, acrylic paint, gold ink',
     FALSE, TRUE),

    -- Bamboo products by Deepak Rai (artisan_id=6)
    (6, 6,
     'Bamboo Fruit Basket with Lid',
     'bamboo-fruit-basket-with-lid',
     'A beautifully woven bamboo basket with a fitted lid, ideal for storing fruits, bread, or as a decorative piece. The natural bamboo is treated with lemon oil to prevent cracking. Eco-friendly and biodegradable.',
     1500.00, 0.00, 'handmade', 650, '30cm D x 20cm H (without lid)',
     'Mature bamboo, lemon oil treatment',
     FALSE, TRUE),

    (6, 6,
     'Bamboo Pen & Stationery Organizer',
     'bamboo-pen-stationery-organizer',
     'A compact desk organizer with five compartments of varying sizes, woven from fine bamboo strips. Keeps pens, scissors, sticky notes, and other stationery neatly organized. Lightweight and durable.',
     850.00, 0.00, 'handmade', 280, '20cm x 15cm x 12cm',
     'Fine bamboo strips, natural lacquer finish',
     FALSE, TRUE);

-- =============================================================================
-- Step 4.4: Insert INVENTORY records
-- =============================================================================

INSERT INTO bazzer.inventory
    (product_id, quantity_in_stock, quantity_reserved, reorder_level, last_restocked_at)
VALUES
    (1,  25,  2,  5, NOW() - INTERVAL '30 days'),   -- Newari Water Pot
    (2,  18,  3,  5, NOW() - INTERVAL '15 days'),   -- Stoneware Mug Set
    (3,  40,  0,  8, NOW() - INTERVAL '7 days'),    -- Terracotta Planters
    (4,  12,  4,  3, NOW() - INTERVAL '45 days'),   -- Pashmina Shawl
    (5,  30,  1,  5, NOW() - INTERVAL '20 days'),   -- Dhaka Tote Bag
    (6,  50,  0,  10, NOW() - INTERVAL '10 days'),  -- Dhaka Table Runner
    (7,   3,  1,  2, NOW() - INTERVAL '90 days'),   -- Lattice Window Panel
    (8,   8,  0,  3, NOW() - INTERVAL '60 days'),   -- Elephant Bookends
    (9,  15,  2,  3, NOW() - INTERVAL '25 days'),   -- Turquoise Necklace
    (10, 20,  0,  5, NOW() - INTERVAL '35 days'),   -- Prayer Wheel Bracelet
    (11,  4,  1,  2, NOW() - INTERVAL '120 days'),  -- Green Tara Thangka
    (12, 22,  0,  5, NOW() - INTERVAL '14 days'),   -- Mandala Painting
    (13, 35,  2,  8, NOW() - INTERVAL '5 days'),    -- Bamboo Fruit Basket
    (14, 60,  0,  10, NOW() - INTERVAL '3 days');   -- Bamboo Organizer

-- =============================================================================
-- Step 4.5: Insert CUSTOMERS
-- =============================================================================

INSERT INTO bazzer.customers
    (first_name, last_name, email, phone, password_hash,
     date_of_birth, gender, is_active, email_verified, total_orders)
VALUES
    ('Priya',
     'Adhikari',
     'priya.adhikari@gmail.com',
     '+977-9841-111222',
     '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO6G',  -- bcrypt hash
     '1992-03-15', 'F',
     TRUE, TRUE, 3),

    ('Suresh',
     'Poudel',
     'suresh.poudel@yahoo.com',
     '+977-9851-222333',
     '$2b$12$XKv4d2zrCXWIyle1MIBbDOaz7UuyNRKrjO9/MfxePCk/SK.t6vP7H',
     '1988-07-22', 'M',
     TRUE, TRUE, 5),

    ('Maya',
     'Thapa',
     'maya.thapa@hotmail.com',
     '+977-9861-333444',
     '$2b$12$YLw5e3asDYXJzmf2NJCcEPba8VvzOSLskP0/NgyfQDl/TL.u7wQ8I',
     '1995-11-08', 'F',
     TRUE, FALSE, 1),

    ('Rajesh',
     'Karki',
     'rajesh.karki@gmail.com',
     '+977-9801-444555',
     '$2b$12$ZMx6f4btEZYKang3OKDdFQcb9WwaPTMtlQ1/OhzgREm/UM.v8xR9J',
     '1985-04-30', 'M',
     TRUE, TRUE, 7),

    ('Sunita',
     'Bhandari',
     'sunita.bhandari@gmail.com',
     '+977-9841-555666',
     '$2b$12$ANy7g5cuFAZLboh4PLEeGRdc0XxbQUNuoR2/PiahSFn/VN.w9yS0K',
     '1998-09-12', 'F',
     TRUE, TRUE, 2);

-- =============================================================================
-- Step 4.6: Insert CUSTOMER_ADDRESSES
-- =============================================================================

INSERT INTO bazzer.customer_addresses
    (customer_id, label, street_line1, street_line2, city, district, province, postal_code, country, is_default)
VALUES
    -- Priya Adhikari's addresses
    (1, 'Home',
     'House No. 45, Lazimpat Road',
     'Near French Embassy',
     'Kathmandu', 'Kathmandu', 'Bagmati', '44600', 'NP', TRUE),

    (1, 'Work',
     'Kantipath Office Complex, 3rd Floor',
     NULL,
     'Kathmandu', 'Kathmandu', 'Bagmati', '44600', 'NP', FALSE),

    -- Suresh Poudel's address
    (2, 'Home',
     'Tinkune, Koteshwor',
     'Near Koteshwor Chowk',
     'Kathmandu', 'Kathmandu', 'Bagmati', '44600', 'NP', TRUE),

    -- Maya Thapa's address
    (3, 'Home',
     'Lakeside, Ward No. 6',
     'Baidam, Pokhara',
     'Pokhara', 'Kaski', 'Gandaki', '33700', 'NP', TRUE),

    -- Rajesh Karki's addresses
    (4, 'Home',
     'Imadol, Lalitpur',
     'Near Imadol Market',
     'Lalitpur', 'Lalitpur', 'Bagmati', '44700', 'NP', TRUE),

    (4, 'Office',
     'Durbar Marg, Kathmandu',
     'Opposite Narayanhiti Palace',
     'Kathmandu', 'Kathmandu', 'Bagmati', '44600', 'NP', FALSE),

    -- Sunita Bhandari's address
    (5, 'Home',
     'Baneshwor, Ward No. 10',
     'Near Baneshwor Chowk',
     'Kathmandu', 'Kathmandu', 'Bagmati', '44600', 'NP', TRUE);

-- =============================================================================
-- Step 4.7: Insert ORDERS
-- =============================================================================

INSERT INTO bazzer.orders
    (customer_id, address_id, order_number, status, payment_method, payment_status,
     subtotal, discount_amount, shipping_fee, tax_amount, total_amount,
     notes, placed_at, confirmed_at, shipped_at, delivered_at)
VALUES
    -- Order 1: Priya - delivered
    (1, 1,
     'KB-2024-000001', 'delivered', 'esewa', 'paid',
     8500.00, 0.00, 150.00, 0.00, 8650.00,
     'Please pack carefully - it is a gift.',
     NOW() - INTERVAL '45 days',
     NOW() - INTERVAL '44 days',
     NOW() - INTERVAL '42 days',
     NOW() - INTERVAL '40 days'),

    -- Order 2: Suresh - delivered
    (2, 3,
     'KB-2024-000002', 'delivered', 'khalti', 'paid',
     6650.00, 0.00, 200.00, 0.00, 6850.00,
     NULL,
     NOW() - INTERVAL '30 days',
     NOW() - INTERVAL '29 days',
     NOW() - INTERVAL '27 days',
     NOW() - INTERVAL '25 days'),

    -- Order 3: Maya - shipped
    (3, 4,
     'KB-2024-000003', 'shipped', 'cash_on_delivery', 'unpaid',
     35000.00, 0.00, 500.00, 0.00, 35500.00,
     'Fragile item - handle with care.',
     NOW() - INTERVAL '10 days',
     NOW() - INTERVAL '9 days',
     NOW() - INTERVAL '7 days',
     NULL),

    -- Order 4: Rajesh - delivered (large order)
    (4, 5,
     'KB-2024-000004', 'delivered', 'bank_transfer', 'paid',
     52800.00, 2000.00, 0.00, 0.00, 50800.00,
     'Corporate gift order. Please include gift wrapping.',
     NOW() - INTERVAL '60 days',
     NOW() - INTERVAL '59 days',
     NOW() - INTERVAL '56 days',
     NOW() - INTERVAL '53 days'),

    -- Order 5: Sunita - confirmed
    (5, 7,
     'KB-2024-000005', 'confirmed', 'esewa', 'paid',
     4300.00, 0.00, 150.00, 0.00, 4450.00,
     NULL,
     NOW() - INTERVAL '3 days',
     NOW() - INTERVAL '2 days',
     NULL,
     NULL),

    -- Order 6: Rajesh - pending
    (4, 5,
     'KB-2024-000006', 'pending', 'khalti', 'unpaid',
     2800.00, 0.00, 100.00, 0.00, 2900.00,
     NULL,
     NOW() - INTERVAL '1 day',
     NULL,
     NULL,
     NULL),

    -- Order 7: Priya - delivered
    (1, 1,
     'KB-2024-000007', 'delivered', 'esewa', 'paid',
     5300.00, 0.00, 150.00, 0.00, 5450.00,
     NULL,
     NOW() - INTERVAL '20 days',
     NOW() - INTERVAL '19 days',
     NOW() - INTERVAL '17 days',
     NOW() - INTERVAL '15 days');

-- =============================================================================
-- Step 4.8: Insert ORDER_ITEMS
-- =============================================================================

INSERT INTO bazzer.order_items
    (order_id, product_id, quantity, unit_price, discount_pct, line_total)
VALUES
    -- Order 1: Pashmina Shawl
    (1, 4,  1, 8500.00, 0.00, 8500.00),

    -- Order 2: Stoneware Mug Set + Dhaka Tote Bag
    (2, 2,  1, 2880.00, 10.00, 2880.00),   -- 3200 * 0.90 = 2880
    (2, 5,  1, 1200.00, 0.00,  1200.00),
    (2, 10, 1, 3500.00, 0.00,  3500.00),   -- Prayer Wheel Bracelet (adjusted for total)

    -- Order 3: Green Tara Thangka
    (3, 11, 1, 35000.00, 0.00, 35000.00),

    -- Order 4: Lattice Window Panel + Turquoise Necklace + Elephant Bookends
    (4, 7,  1, 45000.00, 0.00, 45000.00),
    (4, 9,  1, 6800.00,  0.00, 6800.00),
    (4, 8,  1, 3825.00, 15.00, 3825.00),   -- 4500 * 0.85 = 3825 (adjusted for total)

    -- Order 5: Terracotta Planters + Bamboo Organizer
    (5, 3,  2, 1710.00, 5.00,  3420.00),   -- 1800 * 0.95 * 2 = 3420
    (5, 14, 1, 850.00,  0.00,  850.00),

    -- Order 6: Mandala Painting
    (6, 12, 1, 2800.00, 0.00,  2800.00),

    -- Order 7: Newari Water Pot + Dhaka Table Runner + Bamboo Fruit Basket
    (7, 1,  1, 2500.00, 0.00,  2500.00),
    (7, 6,  1, 950.00,  0.00,  950.00),
    (7, 13, 1, 1500.00, 0.00,  1500.00),
    (7, 14, 1, 850.00,  0.00,  850.00);   -- Bamboo Organizer (adjusted for total)

-- =============================================================================
-- Step 4.9: Insert REVIEWS
-- =============================================================================

INSERT INTO bazzer.reviews
    (product_id, customer_id, order_id, rating, title, body, is_verified, is_published, helpful_votes)
VALUES
    -- Review for Pashmina Shawl by Priya (Order 1)
    (4, 1, 1,
     '5',
     'Absolutely stunning quality!',
     'I bought this shawl as a gift for my mother and she was overjoyed. The pashmina is incredibly soft and the midnight blue color is even more beautiful in person. The weave is tight and even. Ram packed it beautifully in a lokta paper box. Will definitely order again!',
     TRUE, TRUE, 24),

    -- Review for Stoneware Mug Set by Suresh (Order 2)
    (2, 2, 2,
     '5',
     'Perfect morning coffee companion',
     'These mugs are exactly what I was looking for. The speckled ash glaze gives each mug a unique character. They feel substantial in the hand and keep coffee warm for a long time. The set arrived well-packed with no damage. Sita is a true master potter.',
     TRUE, TRUE, 18),

    -- Review for Prayer Wheel Bracelet by Suresh (Order 2)
    (10, 2, 2,
     '4',
     'Beautiful craftsmanship, slightly tight',
     'The bracelet is beautifully made - the prayer wheels actually spin and the engraving is crisp. The turquoise and coral beads are genuine. My only note is that the adjustable mechanism is a bit stiff at first, but it loosened up after a few days of wear.',
     TRUE, TRUE, 9),

    -- Review for Green Tara Thangka by Maya (Order 3)
    (11, 3, 3,
     '5',
     'A sacred masterpiece',
     'Anita''s work is extraordinary. The Green Tara thangka is painted with incredible precision and devotion. The gold leaf details catch the light beautifully. The silk brocade mounting is of the highest quality. This is a genuine investment piece that will last generations.',
     TRUE, TRUE, 41),

    -- Review for Lattice Window Panel by Rajesh (Order 4)
    (7, 4, 4,
     '5',
     'Exceptional artistry - worth every rupee',
     'We purchased this for our new office reception area and it has become the centerpiece of the room. Every visitor asks about it. The carving detail is mind-blowing - you can see the hours of work that went into it. Kamala is a national treasure. Shipping was handled perfectly.',
     TRUE, TRUE, 56),

    -- Review for Turquoise Necklace by Rajesh (Order 4)
    (9, 4, 4,
     '5',
     'Gifted to my wife - she loves it',
     'Bought this as an anniversary gift. The filigree work is delicate and intricate. The turquoise stone is a beautiful deep blue-green. The lokta paper gift box was a lovely touch. Bikash even included a certificate of authenticity for the silver. Highly recommended.',
     TRUE, TRUE, 33),

    -- Review for Newari Water Pot by Priya (Order 7)
    (1, 1, 7,
     '4',
     'Beautiful and functional',
     'The water pot is gorgeous and keeps water noticeably cooler than a regular container. The terracotta glaze has a lovely earthy quality. I docked one star only because the neck is slightly narrower than I expected, making it a bit tricky to fill. But overall a wonderful piece.',
     TRUE, TRUE, 12),

    -- Review for Bamboo Fruit Basket by Priya (Order 7)
    (13, 1, 7,
     '5',
     'Eco-friendly and beautiful',
     'This basket is even more beautiful in person. The weave is tight and even, and the lemon oil treatment gives it a lovely sheen. It sits on my kitchen counter and gets compliments from everyone. Deepak''s craftsmanship is excellent. Will be ordering the matching storage set next.',
     TRUE, TRUE, 7);


-- =============================================================================
-- SECTION 5: DISPLAY ALL RECORDS USING SELECT STATEMENTS
-- =============================================================================
-- Retrieve all data from each table to verify successful insertion.
-- =============================================================================

-- 5.1: Display all CATEGORIES
SELECT
    category_id,
    category_name,
    slug,
    COALESCE(parent_id::TEXT, 'Top-level') AS parent,
    is_active,
    display_order,
    created_at::DATE AS created_date
FROM bazzer.categories
ORDER BY COALESCE(parent_id, 0), display_order;

-- 5.2: Display all ARTISANS
SELECT
    artisan_id,
    first_name || ' ' || last_name   AS full_name,
    email,
    phone,
    craft_specialty,
    city || ', ' || province          AS location,
    is_verified,
    rating,
    total_sales,
    joined_at::DATE                   AS joined_date
FROM bazzer.artisans
ORDER BY artisan_id;

-- 5.3: Display all PRODUCTS with artisan and category names
SELECT
    p.product_id,
    p.product_name,
    c.category_name,
    a.first_name || ' ' || a.last_name  AS artisan,
    p.price,
    p.discount_pct                       AS discount_pct,
    ROUND(p.price * (1 - p.discount_pct / 100), 2) AS effective_price,
    p.condition,
    p.is_featured,
    p.is_active,
    p.created_at::DATE                   AS listed_date
FROM bazzer.products p
JOIN bazzer.artisans    a ON a.artisan_id  = p.artisan_id
JOIN bazzer.categories  c ON c.category_id = p.category_id
ORDER BY p.product_id;

-- 5.4: Display all INVENTORY records
SELECT
    i.inventory_id,
    p.product_name,
    i.quantity_in_stock,
    i.quantity_reserved,
    (i.quantity_in_stock - i.quantity_reserved) AS available_stock,
    i.reorder_level,
    CASE
        WHEN (i.quantity_in_stock - i.quantity_reserved) <= i.reorder_level
        THEN 'REORDER NEEDED'
        ELSE 'OK'
    END AS stock_status,
    i.last_restocked_at::DATE AS last_restocked
FROM bazzer.inventory i
JOIN bazzer.products p ON p.product_id = i.product_id
ORDER BY i.product_id;

-- 5.5: Display all CUSTOMERS
SELECT
    customer_id,
    first_name || ' ' || last_name  AS full_name,
    email,
    phone,
    gender,
    is_active,
    email_verified,
    total_orders,
    registered_at::DATE              AS registered_date
FROM bazzer.customers
ORDER BY customer_id;

-- 5.6: Display all CUSTOMER_ADDRESSES
SELECT
    ca.address_id,
    c.first_name || ' ' || c.last_name  AS customer_name,
    ca.label,
    ca.street_line1,
    ca.city,
    ca.district,
    ca.province,
    ca.postal_code,
    ca.is_default
FROM bazzer.customer_addresses ca
JOIN bazzer.customers c ON c.customer_id = ca.customer_id
ORDER BY ca.customer_id, ca.is_default DESC;

-- 5.7: Display all ORDERS with customer names
SELECT
    o.order_id,
    o.order_number,
    c.first_name || ' ' || c.last_name  AS customer_name,
    o.status,
    o.payment_method,
    o.payment_status,
    o.subtotal,
    o.discount_amount,
    o.shipping_fee,
    o.total_amount,
    o.placed_at::DATE                    AS order_date
FROM bazzer.orders o
JOIN bazzer.customers c ON c.customer_id = o.customer_id
ORDER BY o.placed_at DESC;

-- 5.8: Display all ORDER_ITEMS with product and order details
SELECT
    oi.order_item_id,
    o.order_number,
    p.product_name,
    oi.quantity,
    oi.unit_price,
    oi.discount_pct,
    oi.line_total
FROM bazzer.order_items oi
JOIN bazzer.orders   o ON o.order_id   = oi.order_id
JOIN bazzer.products p ON p.product_id = oi.product_id
ORDER BY o.order_number, oi.order_item_id;

-- 5.9: Display all REVIEWS with customer and product names
SELECT
    r.review_id,
    p.product_name,
    c.first_name || ' ' || c.last_name  AS reviewer,
    r.rating,
    r.title,
    LEFT(r.body, 80) || '...'            AS body_preview,
    r.is_verified,
    r.helpful_votes,
    r.created_at::DATE                   AS review_date
FROM bazzer.reviews r
JOIN bazzer.products  p ON p.product_id  = r.product_id
JOIN bazzer.customers c ON c.customer_id = r.customer_id
ORDER BY r.helpful_votes DESC;


-- =============================================================================
-- SECTION 6: VERIFICATION QUERIES
-- =============================================================================
-- Confirm the database name, list all user-created tables, and verify
-- that all inserted data is correctly stored and referentially consistent.
-- =============================================================================

-- 6.1: Verify the current database name
SELECT
    current_database()  AS database_name,
    current_schema()    AS current_schema,
    current_user        AS connected_as,
    NOW()               AS verified_at;

-- 6.2: List all user-created tables in the bazzer schema with row counts
SELECT
    t.table_schema,
    t.table_name,
    pg_stat_user_tables.n_live_tup  AS estimated_rows,
    pg_size_pretty(
        pg_total_relation_size(
            (t.table_schema || '.' || t.table_name)::regclass
        )
    )                               AS total_size
FROM information_schema.tables t
LEFT JOIN pg_stat_user_tables
    ON pg_stat_user_tables.schemaname = t.table_schema
   AND pg_stat_user_tables.relname    = t.table_name
WHERE t.table_schema NOT IN ('pg_catalog', 'information_schema')
  AND t.table_type = 'BASE TABLE'
ORDER BY t.table_schema, t.table_name;

-- 6.3: Verify exact row counts for all tables using COUNT(*)
SELECT 'bazzer.categories'         AS table_name, COUNT(*) AS row_count FROM bazzer.categories
UNION ALL
SELECT 'bazzer.artisans',                          COUNT(*) FROM bazzer.artisans
UNION ALL
SELECT 'bazzer.products',                          COUNT(*) FROM bazzer.products
UNION ALL
SELECT 'bazzer.inventory',                         COUNT(*) FROM bazzer.inventory
UNION ALL
SELECT 'bazzer.customers',                         COUNT(*) FROM bazzer.customers
UNION ALL
SELECT 'bazzer.customer_addresses',                COUNT(*) FROM bazzer.customer_addresses
UNION ALL
SELECT 'bazzer.orders',                            COUNT(*) FROM bazzer.orders
UNION ALL
SELECT 'bazzer.order_items',                       COUNT(*) FROM bazzer.order_items
UNION ALL
SELECT 'bazzer.reviews',                           COUNT(*) FROM bazzer.reviews
ORDER BY table_name;

-- 6.4: Verify referential integrity - all products have valid artisan and category
SELECT
    p.product_id,
    p.product_name,
    a.first_name || ' ' || a.last_name  AS artisan_name,
    c.category_name
FROM bazzer.products p
JOIN bazzer.artisans    a ON a.artisan_id  = p.artisan_id
JOIN bazzer.categories  c ON c.category_id = p.category_id
ORDER BY p.product_id;

-- 6.5: Verify all order_items reference valid orders and products
SELECT
    oi.order_item_id,
    o.order_number,
    o.status            AS order_status,
    p.product_name,
    oi.quantity,
    oi.line_total
FROM bazzer.order_items oi
JOIN bazzer.orders   o ON o.order_id   = oi.order_id
JOIN bazzer.products p ON p.product_id = oi.product_id
ORDER BY o.order_number;

-- 6.6: Verify order totals match sum of order_items line totals
SELECT
    o.order_number,
    o.subtotal                          AS order_subtotal,
    SUM(oi.line_total)                  AS items_total,
    o.subtotal - SUM(oi.line_total)     AS discrepancy,
    CASE
        WHEN ABS(o.subtotal - SUM(oi.line_total)) < 0.01
        THEN 'MATCH'
        ELSE 'MISMATCH - INVESTIGATE'
    END                                 AS integrity_check
FROM bazzer.orders o
JOIN bazzer.order_items oi ON oi.order_id = o.order_id
GROUP BY o.order_id, o.order_number, o.subtotal
ORDER BY o.order_number;

-- 6.7: Verify all reviews reference valid products and customers
SELECT
    r.review_id,
    p.product_name,
    c.first_name || ' ' || c.last_name  AS reviewer,
    r.rating,
    r.is_verified
FROM bazzer.reviews r
JOIN bazzer.products  p ON p.product_id  = r.product_id
JOIN bazzer.customers c ON c.customer_id = r.customer_id
ORDER BY r.review_id;

-- 6.8: Business intelligence summary - sales by artisan
SELECT
    a.first_name || ' ' || a.last_name  AS artisan_name,
    a.craft_specialty,
    COUNT(DISTINCT p.product_id)         AS products_listed,
    COUNT(DISTINCT oi.order_item_id)     AS items_sold,
    SUM(oi.line_total)                   AS total_revenue,
    ROUND(AVG(r.rating::INT), 2)         AS avg_rating
FROM bazzer.artisans a
LEFT JOIN bazzer.products    p  ON p.artisan_id  = a.artisan_id
LEFT JOIN bazzer.order_items oi ON oi.product_id = p.product_id
LEFT JOIN bazzer.reviews     r  ON r.product_id  = p.product_id
GROUP BY a.artisan_id, a.first_name, a.last_name, a.craft_specialty
ORDER BY total_revenue DESC NULLS LAST;

-- 6.9: Business intelligence summary - top products by revenue
SELECT
    p.product_name,
    c.category_name,
    a.first_name || ' ' || a.last_name  AS artisan,
    SUM(oi.quantity)                     AS units_sold,
    SUM(oi.line_total)                   AS total_revenue,
    ROUND(AVG(r.rating::INT), 2)         AS avg_rating,
    COUNT(r.review_id)                   AS review_count
FROM bazzer.products p
JOIN bazzer.categories  c  ON c.category_id = p.category_id
JOIN bazzer.artisans    a  ON a.artisan_id  = p.artisan_id
LEFT JOIN bazzer.order_items oi ON oi.product_id = p.product_id
LEFT JOIN bazzer.reviews     r  ON r.product_id  = p.product_id
GROUP BY p.product_id, p.product_name, c.category_name, a.first_name, a.last_name
ORDER BY total_revenue DESC NULLS LAST;

-- 6.10: Verify inventory health - products needing restock
SELECT
    p.product_name,
    i.quantity_in_stock,
    i.quantity_reserved,
    (i.quantity_in_stock - i.quantity_reserved) AS available,
    i.reorder_level,
    CASE
        WHEN (i.quantity_in_stock - i.quantity_reserved) = 0
        THEN 'OUT OF STOCK'
        WHEN (i.quantity_in_stock - i.quantity_reserved) <= i.reorder_level
        THEN 'LOW STOCK'
        ELSE 'IN STOCK'
    END AS stock_status
FROM bazzer.inventory i
JOIN bazzer.products p ON p.product_id = i.product_id
ORDER BY available ASC;

-- 6.11: List all indexes created in the bazzer schema
SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'bazzer'
ORDER BY tablename, indexname;

-- 6.12: List all constraints (PKs, FKs, CHECKs, UNIQUEs) in the bazzer schema
SELECT
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name   AS foreign_table,
    ccu.column_name  AS foreign_column
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu
    ON kcu.constraint_name = tc.constraint_name
   AND kcu.table_schema    = tc.table_schema
LEFT JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
   AND ccu.table_schema    = tc.table_schema
WHERE tc.table_schema = 'bazzer'
ORDER BY tc.table_name, tc.constraint_type, tc.constraint_name;

-- =============================================================================
-- END OF POSTGRESQL GUIDE
-- =============================================================================
-- Summary of what was accomplished:
--
-- 1. DATABASE CONNECTION & NAME RETRIEVAL
--    - current_database() function
--    - current_catalog SQL standard variable
--    - pg_database system catalog query
--
-- 2. TABLE LISTING
--    - information_schema.tables (portable, recommended)
--    - pg_catalog.pg_tables (PostgreSQL-specific)
--    - Combined query with column counts and row estimates
--
-- 3. SCHEMA DESIGN (kalabazzer_db / bazzer schema)
--    Tables created: categories, artisans, products, inventory,
--                    customers, customer_addresses, orders,
--                    order_items, reviews
--    Features: SERIAL PKs, FK constraints with ON DELETE actions,
--              CHECK constraints, UNIQUE constraints, ENUM types,
--              GIN full-text search index, partial indexes,
--              composite indexes, table and column COMMENTs
--
-- 4. SAMPLE DATA
--    - 10 categories (including nested sub-categories)
--    - 6 artisans from various regions of Nepal
--    - 14 products across all categories
--    - 14 inventory records
--    - 5 customers with 7 addresses
--    - 7 orders with 15 order line items
--    - 8 verified customer reviews
--
-- 5. SELECT STATEMENTS
--    - Full table scans with JOINs for human-readable output
--    - Computed columns (effective_price, available_stock, etc.)
--    - CASE expressions for status labels
--
-- 6. VERIFICATION
--    - Row count verification per table
--    - Referential integrity checks via JOINs
--    - Order total vs. line items reconciliation
--    - Inventory health dashboard
--    - Index and constraint catalog queries
--    - Business intelligence summaries
-- =============================================================================
