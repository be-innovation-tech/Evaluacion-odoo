/** @odoo-module */

import { isMobileOS } from "@web/core/browser/feature_detection";
import { useService } from "@web/core/utils/hooks";
import { patch } from "@web/core/utils/patch";
import { ListRenderer } from "@web/views/list/list_renderer";
import { PromoteStudioDialog } from "@web_enterprise/webclient/promote_studio_dialog/promote_studio_dialog";
import { useState, onWillUnmount } from "@odoo/owl";

export const patchListRendererDesktop = {
    setup() {
        this._super(...arguments);
        this.userService = useService("user");
        this.actionService = useService("action");
        this.studioEditable = useState({ value: !isMobileOS() && this.userService.isSystem });
        const onUiUpdated = () => {
            const list = this.props.list;
            const action = this.actionService.currentController.action;
            this.studioEditable.value =
                !isMobileOS() &&
                this.userService.isSystem &&
                action &&
                action.id &&
                action.type === "ir.actions.act_window" &&
                !!action.xml_id &&
                list === list.model.root;
        }

        this.env.bus.addEventListener("ACTION_MANAGER:UI-UPDATED", onUiUpdated);

        // Stop Listening to "ACTION_MANAGER:UI-UPDATED"
        onWillUnmount(() => {
            this.env.bus.removeEventListener("ACTION_MANAGER:UI-UPDATED", onUiUpdated);
        })
    },

    get isStudioEditable() {
        return this.studioEditable.value;
    },

    set isStudioEditable(value) {
        this.studioEditable.value = value;
    },

    get displayOptionalFields() {
        return this.isStudioEditable || this.getOptionalFields.length;
    },

    /**
     * This function opens promote studio dialog
     *
     * @private
     */
    onSelectedAddCustomField() {
        this.env.services.dialog.add(PromoteStudioDialog, {});
    },
};

patch(ListRenderer.prototype, "web_enterprise.ListRendererDesktop", patchListRendererDesktop);
