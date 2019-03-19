export class ClientHelper {
    static promptForRemove(array: any[], index: number, message = 'Are you sure you want to remove this item?', event = null) {
        if (confirm(message)) {
            array.splice(index, 1);
            event.preventDefault();
        }
    }
}