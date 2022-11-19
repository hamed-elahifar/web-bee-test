import MenuItem from "./entities/menu-item.entity";

class MenuItemsExtended extends MenuItem {
  children: MenuItemsExtended[] | [];
}

export class MenuItemsService {
  async getMenuItems() {
    const menu: MenuItemsExtended[] = [];
    const menuItems = await MenuItemsExtended.findAll({ raw: true });

    menuItems.forEach((item: MenuItemsExtended) => {
      item.children = [];

      let list = menuItems.filter((i) => i.parentId === item.id);

      if (list.length) {
        item.children = list;
      }

      if (!item.parentId) menu.push(item);
    });

    return menu;
  }
}
