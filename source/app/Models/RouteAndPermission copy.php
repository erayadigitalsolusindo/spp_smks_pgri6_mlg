<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class RouteAndPermission extends Model
{
    protected $table = 'permissions';
    protected $fillable = [
        'name',
        'guard_name',
        'description',
        'group',
        'urutan'
    ];

    public static function listPermissionTabel($req, $perHalaman, $offset)
    {
        $parameterpencarian = $req->parameter_pencarian;
        $query = DB::table((new self())->getTable());
        if (!empty($parameterpencarian)) {
            $query->where('name', 'LIKE', '%' . $parameterpencarian . '%')
                  ->orWhere('group', 'LIKE', '%' . $parameterpencarian . '%');
        }
        $result = $query->take($perHalaman)
            ->skip($offset)
            ->orderBy('urutan', 'ASC')
            ->get();
        $jumlahdata = $query->count();
        return [
            'data' => $result,
            'total' => $jumlahdata
        ];
    }
    public static function listRoleTabel($req, $perHalaman, $offset)
    {
        $parameterpencarian = $req->parameter_pencarian;
        $tablePrefix = config('database.connections.mysql.prefix');
        $query = DB::table('roles')
            ->leftJoin('role_has_permissions', 'roles.id', '=', 'role_has_permissions.role_id')
            ->leftJoin('permissions', 'role_has_permissions.permission_id', '=', 'permissions.id')
            ->select('roles.*', DB::raw('GROUP_CONCAT(' . $tablePrefix . 'permissions.name) as permissions'));
        if (!empty($parameterpencarian)) {
            $query->where(function($q) use ($parameterpencarian) {
                $q->where('roles.name', 'LIKE', '%' . $parameterpencarian . '%')
                  ->orWhere('roles.description', 'LIKE', '%' . $parameterpencarian . '%');
            });
        }
        $result = $query->groupBy('roles.id')
            ->take($perHalaman)
            ->skip($offset)
            ->orderBy('roles.id', 'ASC')
            ->get();
        $jumlahdata = $result->count();
        return [
            'data' => $result,
            'total' => $jumlahdata
        ];
    }
    
}

