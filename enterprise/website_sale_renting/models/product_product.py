# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import models

class ProductProduct(models.Model):
    _inherit = 'product.product'

    def _website_show_quick_add(self):
        self.ensure_one()
        return not self.rent_ok and super()._website_show_quick_add()

    def _is_add_to_cart_allowed(self):
        self.ensure_one()
        return super()._is_add_to_cart_allowed() or (self.active and self.rent_ok and self.website_published)
