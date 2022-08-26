export function getBatchQuery (): string {
    const query = `select b.id, u.email as created_by, f.name as farm_name, b.name,
        b.active, b.bird_category, b.initial_population, b.total_cost, b.created_at, b.updated_at 
        from public.batch as b
        join auth.users as u on b.created_by = u.id
        join public.farms as f on f.id = b.farm_id 
        where b.id = $1
    `
    return query
}
