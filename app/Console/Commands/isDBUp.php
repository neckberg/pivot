<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class isDBUp extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'isDBUp';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Returns \'true\' if the database can be connected to';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        try {
            DB::Connection()->selectOne('SELECT 1');
        } catch (\Exception $e) {
            $this->line('false');
            return;
        }
        $this->line('true');
    }
}
