"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBatchQuery = void 0;
function getBatchQuery() {
    const query = `select b.id, u.email as created_by, f.name as farm_name, b.name,
        b.active, b.bird_category, b.initial_population, b.total_cost, b.created_at, b.updated_at 
        from public.batch as b
        join auth.users as u on b.created_by = u.id
        join public.farms as f on f.id = b.farm_id 
        where b.farm_id = $1
    `;
    return query;
}
exports.getBatchQuery = getBatchQuery;
