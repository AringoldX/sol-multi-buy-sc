pub mod constants;
pub mod instructions;

use anchor_lang::prelude::*;

pub use constants::*;
use instructions::*;

declare_id!("CprucEGtqY3ntLcT31ag1RmhRQZ1AU4jMf4DMuYcimdH");

#[program]
pub mod multi_buy {
    use super::*;

    pub fn multi_buy(
        ctx: Context<MultiBuy>,
        amount_in: u64,
        minimum_amount_out: u64,
        token_length: u8,
    ) -> Result<()> {
        instructions::multi_buy(ctx, amount_in, minimum_amount_out, token_length)
    }
}
