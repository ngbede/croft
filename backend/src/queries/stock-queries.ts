export function getStockInfo(): string {
    const query = `select f.name as farm_name, b.name as batch_name, u.email as created_by, u.raw_user_meta_data 
        from stock_report as s
        left join farms as f on s.farm_id = f.id
        left join batch as b on s.batch_id = b.id
        left join auth.users as u on s.created_by = u.id 
        where s.id = $1;
    `
    return query
}
