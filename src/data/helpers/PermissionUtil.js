// Convenience methods on permission objects
export const PermissionUtil = {
  isHidden(p) {
    return p && ((p.authorized === false && p.behavior === "hide") ||
      (p.authorized === true && p.behavior === "show_if_unauthorized"));
  },

  isDisabled(p) {
    return p && p.authorized === false && p.behavior === "disable"
  },

  showPurchaseOptions(p) {
    return p && (p.authorized === false && p.behavior === "show_purchase");
  },

  showAlternatePage(p) {
    return p && (p.authorized === false && p.behavior === "show_alternate_page" && p.alternate_page_id);
  },
};
