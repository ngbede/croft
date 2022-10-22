export function getFarmDetailQuery(list?: boolean): string {
    const query = `
        WITH farm_batch AS (
            SELECT farm_id,
                COUNT(*) as total_batches
            FROM public.batch
            GROUP BY farm_id
        ),
        farm_staff as (
            SELECT farm_id,
                COUNT(*) as total_staff
            from public.staff
            GROUP BY farm_id
        ),
        all_eggs_picked AS (
            SELECT r.farm_id,
                r.egg_count->>'eggs_picked' as eggs_picked
            from public.stock_report as r
        ),
        aggregate_egg_count AS (
            SELECT farm_id,
                SUM(COALESCE(eggs_picked::INTEGER, 0)) as total_eggs_picked
            from all_eggs_picked
            GROUP BY farm_id
        )
        SELECT f.*,
            a.email,
            a.raw_user_meta_data as owner_data,
            s.crate_price,
            s.chicken_price,
            s.eggs_per_crate,
            COALESCE(fb.total_batches, 0) as total_batches,
            COALESCE(fs.total_staff, 0) as total_staff,
            COALESCE(ec.total_eggs_picked::INTEGER, 0) as eggs_picked
        FROM public.farms AS f
            LEFT JOIN auth.users a ON f.owner_id = a.id
            LEFT JOIN public.farm_setting s ON f.id = s.farm_id
            LEFT JOIN farm_batch fb ON fb.farm_id = f.id
            LEFT JOIN farm_staff fs ON fs.farm_id = f.id
            LEFT JOIN aggregate_egg_count ec ON f.id = ec.farm_id
            ${list ? '' : 'WHERE f.id = $1'}
        `
    return query
}
