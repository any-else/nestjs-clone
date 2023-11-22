"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteProductvariantNull1687536372687 = void 0;
class DeleteProductvariantNull1687536372687 {
    async up(queryRunner) {
        await queryRunner.query(`
            DELETE FROM products_variant WHERE product_id IS NULL
        `);
    }
    async down(queryRunner) { }
}
exports.DeleteProductvariantNull1687536372687 = DeleteProductvariantNull1687536372687;
//# sourceMappingURL=1687536372687-deleteProductvariantNull.js.map