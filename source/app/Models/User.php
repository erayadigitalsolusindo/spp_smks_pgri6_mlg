<?php

namespace App\Models;

use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Support\Facades\DB;
class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;
     /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'uuid',
        'username',
        'email',
        'email_verified_at',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }
    
    public function getJWTCustomClaims()
    {
        return [];
    }
    public function detailUserInformation($user_id)
    {
        return User::join('users_pegawai', 'users.id', '=', 'users_pegawai.id')
            ->select(
                'users.*',
                'users_pegawai.*'
            )
            ->where('users.id', '=', $user_id)
            ->first();
    }
    public static function userInformation($request, $perHalaman, $offset){
        $parameterpencarian = $request->parameter_pencarian;
        $fecthdata = User::join('users_pegawai', 'users.id', '=', 'users_pegawai.id')
            ->leftJoin('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
            ->leftJoin('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->select(
                'users.*',
                'users_pegawai.*',
                'users_pegawai.id as id_user_pegawai',
                'roles.name as role_name'
            )
            ->where(function ($query) use ($parameterpencarian) {
                $query->where('users.username', 'like', '%' . $parameterpencarian . '%')
                    ->orWhere('users.email', 'like', '%' . $parameterpencarian . '%')
                    ->orWhere('users_pegawai.id', 'like', '%' . $parameterpencarian . '%')
                    ->orWhere('users_pegawai.nik', 'like', '%' . $parameterpencarian . '%')
                    ->orWhere('users_pegawai.nama_pegawai', 'like', '%' . $parameterpencarian . '%');
            })
            ->take($perHalaman)
            ->skip($offset)
            ->get();
        
        $jumlahdata = $fecthdata->count();
        
        return [
            'data' => $fecthdata,
            'total' => $jumlahdata
        ];
        
    }
    public static function assignRole($role, $user_id)
    {
        $existingRole = DB::table('model_has_roles')
            ->where('model_id', $user_id)
            ->where('model_type', self::class)
            ->first();

        if ($existingRole) {
            return DB::table('model_has_roles')
                ->where('model_id', $user_id)
                ->where('model_type', self::class)
                ->update([
                    'role_id' => $role,
                    'team_id' => 1,
                ]);
        }
        return DB::table('model_has_roles')->insert([
            'role_id' => $role,
            'model_type' => self::class,
            'model_id' => $user_id,
            'team_id' => 1,
        ]);
    }
    public static function deleteRole($user_id){
        return DB::table('model_has_roles')->where('model_id', '=', $user_id)->delete();
    }
    public static function detailUser($request){
        return User::join('users_pegawai', 'users.id', '=', 'users_pegawai.id')
            ->leftJoin('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
            ->leftJoin('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->select('users.*', 'users_pegawai.*', 'roles.name as role_name', 'roles.id as id_role')
            ->where('users.id', '=', $request->id)
            ->first();
    }
}
