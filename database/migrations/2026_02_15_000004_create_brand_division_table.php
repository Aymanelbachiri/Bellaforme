<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Create pivot table
        Schema::create('brand_division', function (Blueprint $table) {
            $table->id();
            $table->foreignId('brand_id')->constrained()->cascadeOnDelete();
            $table->foreignId('division_id')->constrained()->cascadeOnDelete();
            $table->unique(['brand_id', 'division_id']);
        });

        // Migrate existing division_id data to pivot
        $brands = DB::table('brands')->whereNotNull('division_id')->get(['id', 'division_id']);
        foreach ($brands as $brand) {
            DB::table('brand_division')->insert([
                'brand_id' => $brand->id,
                'division_id' => $brand->division_id,
            ]);
        }

        // Drop the old column
        Schema::table('brands', function (Blueprint $table) {
            $table->dropForeign(['division_id']);
            $table->dropColumn('division_id');
        });
    }

    public function down(): void
    {
        Schema::table('brands', function (Blueprint $table) {
            $table->foreignId('division_id')->nullable()->after('id')->constrained('divisions')->nullOnDelete();
        });

        // Migrate first pivot entry back
        $pivots = DB::table('brand_division')
            ->select('brand_id', DB::raw('MIN(division_id) as division_id'))
            ->groupBy('brand_id')
            ->get();
        foreach ($pivots as $pivot) {
            DB::table('brands')->where('id', $pivot->brand_id)->update(['division_id' => $pivot->division_id]);
        }

        Schema::dropIfExists('brand_division');
    }
};
