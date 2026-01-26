-- PrintMedia MySQL Database Schema
-- For Hostinger MySQL Database
-- Run this in phpMyAdmin or MySQL CLI

-- Create database (if not exists)
-- CREATE DATABASE IF NOT EXISTS u123456789_printmedia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE u123456789_printmedia;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Pages table
CREATE TABLE IF NOT EXISTS pages (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    meta_title VARCHAR(255),
    meta_desc TEXT,
    content LONGTEXT,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_published (is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sections table
CREATE TABLE IF NOT EXISTS sections (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    page_id VARCHAR(36) NOT NULL,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255),
    content LONGTEXT,
    `order` INT DEFAULT 0,
    settings TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
    INDEX idx_page_id (page_id),
    INDEX idx_order (`order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    slug VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id VARCHAR(36),
    `order` INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_parent (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    slug VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    features TEXT,
    specs TEXT,
    category_id VARCHAR(36),
    product_number VARCHAR(100),
    is_published BOOLEAN DEFAULT TRUE,
    `order` INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_category (category_id),
    INDEX idx_published (is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product images table
CREATE TABLE IF NOT EXISTS product_images (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_id VARCHAR(36) NOT NULL,
    url VARCHAR(500) NOT NULL,
    alt VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    `order` INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_id VARCHAR(36),
    title VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    type VARCHAR(50) DEFAULT 'pdf',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    `key` VARCHAR(255) NOT NULL UNIQUE,
    `value` LONGTEXT,
    type VARCHAR(50) DEFAULT 'text',
    `group` VARCHAR(100) DEFAULT 'general',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (`key`),
    INDEX idx_group (`group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Navigation table
CREATE TABLE IF NOT EXISTS navigation (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    location VARCHAR(100) NOT NULL UNIQUE,
    items LONGTEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_location (location)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Media table
CREATE TABLE IF NOT EXISTS media (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    filename VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size INT NOT NULL,
    alt VARCHAR(255),
    folder VARCHAR(100) DEFAULT 'uploads',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_folder (folder),
    INDEX idx_mime_type (mime_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert admin user (password: admin123 - CHANGE THIS!)
INSERT INTO users (id, email, password, name, role) VALUES
(UUID(), 'admin@printmedia.fi', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4oPCWJakJcqOqLXy', 'Admin', 'admin')
ON DUPLICATE KEY UPDATE id=id;

-- Insert default settings
INSERT INTO settings (`key`, `value`, type, `group`) VALUES
('site_name', 'PrintMedia PM Solutions Oy', 'text', 'general'),
('site_tagline', 'Suurkuvatulostusalan tukkukauppa', 'text', 'general'),
('site_description', 'Valikoimastamme löydät mm. tulostusmediat, tulostusvärit, display-tuotteet sekä monet muut laadukkaat ratkaisut edullisesti juuri sinun tarpeisiin.', 'text', 'general'),
('contact_phone', '+358 440 875 025', 'text', 'contact'),
('contact_email', 'myynti@printmedia.fi', 'text', 'contact'),
('contact_address', '{"street":"Koskueentie 7","postalCode":"19700","city":"Sysmä","country":"Finland"}', 'json', 'contact'),
('business_hours', '07:30 – 15:30', 'text', 'contact'),
('business_id', '1877937-4', 'text', 'company'),
('invoicing_ovt', '003718779374', 'text', 'invoicing'),
('invoicing_operator', 'Ropo Capital', 'text', 'invoicing'),
('invoicing_operator_id', '003714377140', 'text', 'invoicing')
ON DUPLICATE KEY UPDATE `value`=VALUES(`value`);

-- Insert categories
INSERT INTO categories (id, slug, name, description, `order`) VALUES
(UUID(), 'tulostusvarit', 'Tulostusvärit', 'Eco-solvent tulostusvärit suurkuvatulostimiin', 1),
(UUID(), 'tulostusmateriaalit', 'Tulostusmateriaalit', 'Laaja valikoima tulostusmedioita', 2),
(UUID(), 'display-tuotteet', 'Display-tuotteet', 'Roll-upit, messupöydät ja messuseinät', 3),
(UUID(), 'laitteet', 'Laitteet', 'Tulostimet, leikkurit ja laminaattorit', 4),
(UUID(), 'muut-tarvikkeet', 'Muut tarvikkeet', 'Turvaviivaimet ja kiinnikkeet', 5),
(UUID(), 'huolto-ja-tuki', 'Huolto ja tuki', 'Varaosat ja ohjelmistot', 6)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert main navigation
INSERT INTO navigation (id, location, items) VALUES
(UUID(), 'main', '[
  {"id":"tulostusvarit","title":"Tulostusvärit","href":"/tulostusvaerit","children":[{"id":"jetbest","title":"Jetbest","href":"/tulostusvaerit/jetbest"}]},
  {"id":"tulostusmateriaalit","title":"Tulostusmateriaalit","href":"/tulostusmateriaalit"},
  {"id":"display-tuotteet","title":"Display-tuotteet","href":"/display-tuotteet","children":[{"id":"roll-up","title":"Roll Up","href":"/display-tuotteet/roll-up"},{"id":"messupoydat","title":"Messupöydät","href":"/display-tuotteet/messupoydat"},{"id":"messuseinat","title":"Messuseinät","href":"/display-tuotteet/messuseinat"},{"id":"muut","title":"Muut","href":"/display-tuotteet/muut"}]},
  {"id":"laitteet","title":"Laitteet","href":"/laitteet","children":[{"id":"docan","title":"Docan UV-tulostimet","href":"/laitteet/docan-uv-tulostimet"},{"id":"gcc","title":"GCC-tarraleikkurit","href":"/laitteet/gcc-tarraleikkurit"},{"id":"monitoimileikkurit","title":"Monitoimileikkurit","href":"/laitteet/monitoimileikkurit"},{"id":"laminaattorit","title":"Laminaattorit","href":"/laitteet/laminaattorit"}]},
  {"id":"muut-tarvikkeet","title":"Muut tarvikkeet","href":"/muut-tarvikkeet"},
  {"id":"huolto-ja-tuki","title":"Huolto ja tuki","href":"/huolto-ja-tuki","children":[{"id":"tulostimien-varaosat","title":"Tulostimien varaosat","href":"/huolto-ja-tuki/tulostimien-varaosat"},{"id":"leikkureiden-varaosat","title":"Leikkureiden varaosat","href":"/huolto-ja-tuki/leikkureiden-varaosat"},{"id":"ergosoft","title":"Ergosoft RIP","href":"/huolto-ja-tuki/ergosoft-rip"},{"id":"flexi","title":"SAi Flexi","href":"/huolto-ja-tuki/flexi"}]},
  {"id":"yritys","title":"Yritys","href":"/"},
  {"id":"toimitusehdot","title":"Toimitusehdot","href":"/toimitusehdot"},
  {"id":"hinnasto","title":"Hinnasto","href":"/hinnasto"},
  {"id":"yhteystiedot","title":"Yhteystiedot","href":"/yhteystiedot"}
]')
ON DUPLICATE KEY UPDATE items=VALUES(items);

-- Insert home page
INSERT INTO pages (id, slug, title, meta_title, meta_desc, content, is_published) VALUES
(UUID(), 'home', 'Etusivu', 'PrintMedia PM Solutions Oy - Suurkuvatulostusalan tukkukauppa', 'Valikoimastamme löydät tulostusmediat, tulostusvärit, display-tuotteet sekä monet muut laadukkaat ratkaisut.', '{"hero":{"title":"PrintMedia PM Solutions Oy","subtitle":"Suurkuvatulostusalan tukkukauppa","description":"Valikoimastamme löydät mm. tulostusmediat, tulostusvärit, display-tuotteet sekä monet muut laadukkaat ratkaisut edullisesti juuri sinun tarpeisiin."}}', TRUE)
ON DUPLICATE KEY UPDATE title=VALUES(title);
