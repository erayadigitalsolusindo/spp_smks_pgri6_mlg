<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RouteAndPermission;
use App\Helpers\ResponseHelper;
use Illuminate\Support\Facades\{Log, Validator};
use Spatie\Permission\Models\Role;

class RoleAndPermissionController extends Controller
{
    function addpermission(Request $req)
    {
        try {
            $validator = Validator::make($req->all(), [
                'nama_hakakses' => 'required|string|max:255|unique:permissions,name',
                'keterangan' => 'required|string',
                'namagroup' => 'required|string',
            ]);
            if ($validator->fails()) {
                $dynamicAttributes = ['errors' => $validator->errors()];
                return ResponseHelper::error_validation(__('auth.eds_required_data'), $dynamicAttributes);
            }
            $nama_hakakses = $req->input('nama_hakakses');
            $keterangan = $req->input('keterangan');
            $group = $req->input('namagroup');
            RouteAndPermission::create([
                'name' => $nama_hakakses,
                'guard_name' => 'web',
                'group' => $group,
                'description' => $keterangan,
                'urutan' => 0
            ]);
            return ResponseHelper::success('Hak akses '.$nama_hakakses.' dengan keterangan '.$keterangan.' berhasil ditambahkan.');
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
    public function getpermission(Request $req)
    {
        try {
            $perHalaman = (int) $req->length > 0 ? (int) $req->length : 1;
            $nomorHalaman = (int) $req->start / $perHalaman;
            $offset = $nomorHalaman * $perHalaman; 
            $datatabel = RouteAndPermission::listPermissionTabel($req, $perHalaman, $offset);
            $jumlahdata = $datatabel['total'];
            $dynamicAttributes = [
                'data' => $datatabel['data'],
                'recordsFiltered' => $jumlahdata,
                'pages' => [
                    'limit' => $perHalaman,
                    'offset' => $offset,
                ],
            ];
            return ResponseHelper::data(__('common.data_ready', ['namadata' => 'Informasi Hak Akses']), $dynamicAttributes);
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
    public function deletepermission(Request $req){
        try {
            $validator = Validator::make($req->all(), [
                'idhakakses' => 'required|integer',
                'namahakakses' => 'required|string',
            ]);
            if ($validator->fails()) {
                $dynamicAttributes = ['errors' => $validator->errors()];
                return ResponseHelper::error_validation(__('auth.eds_required_data'), $dynamicAttributes);
            }
            $idHakAkses = $req->idhakakses;
            $namaHakAkses = $req->namahakakses;
            $permission = RouteAndPermission::find($idHakAkses);
            if (!$permission) {
                return ResponseHelper::data_not_found(__('common.data_not_found', ['namadata' => 'Hak Akses']));
            }
            $permission->delete();
            return ResponseHelper::success(__('common.data_deleted', ['namadata' => 'Hak Akses ' . $namaHakAkses]));
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
    public function editpermission(Request $req){
        try {
            $validator = Validator::make($req->all(), [
                'namahakakses' => 'required|string|max:255',
                'keteranganhakakses' => 'required|string',
            ]);
            if ($validator->fails()) {
                $dynamicAttributes = ['errors' => $validator->errors()];
                return ResponseHelper::error_validation(__('auth.eds_required_data'), $dynamicAttributes);
            }
            $idHakAkses = (int)$req->input('idhakakses');
            $namaHakAkses = $req->input('namahakakses');
            $keterangan = $req->input('keteranganhakakses');
            $permission = RouteAndPermission::find($idHakAkses);
            $permission->update([
                'name' => $namaHakAkses,
                'description' => $keterangan
            ]);
            return ResponseHelper::success('Hak akses '.$namaHakAkses.' dengan keterangan '.$keterangan.' berhasil diubah.');
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
    public function addrole(Request $req){
        try {
            $validator = Validator::make($req->all(), [
                'name' => 'required|string|max:255|unique:roles,name',
                'description' => 'required|string',
                'permissions' => 'required|array',
            ]);
            if ($validator->fails()) {
                $dynamicAttributes = ['errors' => $validator->errors()];
                return ResponseHelper::error_validation(__('auth.eds_required_data'), $dynamicAttributes);
            }
            $nama_role = $req->input('name');
            $keterangan_role = $req->input('description');
            $permissions = $req->input('permissions');
            $role = Role::create([
                'team_id' => 1,
                'name' => $nama_role,
                'description' => $keterangan_role,
                'guard_name' => 'web' 
            ]);
            if (!empty($permissions)) {
                $role->givePermissionTo($permissions);
            }
            return ResponseHelper::success('Role ' . $nama_role . ' berhasil dibuat.');
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
    public function getrole(Request $req){
        try {
            $perHalaman = (int) $req->length > 0 ? (int) $req->length : 1;
            $nomorHalaman = (int) $req->start / $perHalaman;
            $offset = $nomorHalaman * $perHalaman; 
            $datatabel = RouteAndPermission::listRoleTabel($req, $perHalaman, $offset);
            $jumlahdata = $datatabel['total'];
            $dynamicAttributes = [  
                'data' => $datatabel['data'],
                'recordsFiltered' => $jumlahdata,
                'pages' => [
                    'limit' => $perHalaman,
                    'offset' => $offset,
                ],
            ];
            return ResponseHelper::data(__('common.data_ready', ['namadata' => 'Informasi Role']), $dynamicAttributes);
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
    public function deleterole(Request $req){
        try {
            $validator = Validator::make($req->all(), [
                'idrole' => 'required|integer',
                'namarole' => 'required|string',
            ]);
            if ($validator->fails()) {
                $dynamicAttributes = ['errors' => $validator->errors()];
                return ResponseHelper::error_validation(__('auth.eds_required_data'), $dynamicAttributes);
            }
            $idRole = $req->idrole;
            $namaRole = $req->namarole;
            $role = Role::where('id', $idRole)->delete();
            return ResponseHelper::success(__('common.data_deleted', ['namadata' => 'Role ' . $namaRole]));
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
    public function detailrole(Request $req){
        try {
            $idRole = $req->idrole;
            $role = Role::with('permissions:id,name')->find($idRole);
            $dynamicAttributes = [  
                'data' => $role,
            ];
            return ResponseHelper::data(__('common.data_ready', ['namadata' => 'Informasi Role']), $dynamicAttributes);
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }
    }
    function editrole(Request $req){
        try {
            $validator = Validator::make($req->all(), [
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'permissions' => 'required|array',
            ]);
            if ($validator->fails()) {
                $dynamicAttributes = ['errors' => $validator->errors()];
                return ResponseHelper::error_validation(__('auth.eds_required_data'), $dynamicAttributes);
            }
            $idRole = $req->input('idrole');
            $nama_role = $req->input('name');
            $keterangan_role = $req->input('description');
            $permissions = $req->input('permissions');
            $role = Role::find($idRole);
            if (!$role) {
                throw new \Exception("Role not found");
            }
            $role->update([
                'name' => $nama_role,
                'description' => $keterangan_role,
                'guard_name' => 'web',
            ]);
            if (!empty($permissions)) {
                $role->syncPermissions($permissions);
            }
        
            return ResponseHelper::success('Role ' . $nama_role . ' berhasil diubah.');
        } catch (\Throwable $th) {
            return ResponseHelper::error($th);
        }        
    }
}
