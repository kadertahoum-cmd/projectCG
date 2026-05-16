# Deploy La Rose Eternelle

## 1. Hosting requirements

- PHP 8.0 or newer
- MySQL or MariaDB
- Apache with `.htaccess` enabled, or any PHP hosting that supports PDO MySQL

## 2. Create the database

Open phpMyAdmin, create/import SQL, then import:

```sql
database.sql
```

This creates:

- `orders`
- `contact_messages`
- `newsletter_subscribers`

## 3. Configure PHP database access

Edit:

```txt
config/database.php
```

Change these values to match your hosting account:

```php
const DB_HOST = 'localhost';
const DB_NAME = 'laroseeternelle';
const DB_USER = 'your_mysql_user';
const DB_PASS = 'your_mysql_password';
```

Also change the admin password before uploading:

```php
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'change-this-password';
```

## 4. Upload files

Upload the full project to your hosting `public_html` or website root:

- `index.html`
- `product.html`
- `contact.html`
- `cart.js`
- `index.css`
- `proj.css`
- `api/`
- `config/`
- `admin/`
- images

Do not delete `.htaccess`.

## 5. Admin page

After upload, open:

```txt
https://your-domain.com/admin/
```

Use the username and password from `config/database.php`.

## 6. How orders work

When a customer confirms an order:

1. The order is saved in MySQL through `api/orders.php`.
2. WhatsApp opens with the prepared order message.
3. You can see orders in `/admin/`.

When a customer sends the contact form:

1. The message is saved in MySQL through `api/contact.php`.
2. WhatsApp opens with the prepared contact message.
3. You can see messages in `/admin/`.

When a customer subscribes to the newsletter:

1. The email is saved in MySQL through `api/newsletter.php`.
2. You can see subscribers in `/admin/`.
