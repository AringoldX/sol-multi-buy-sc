use std::str::FromStr;

use anchor_lang::{prelude::*, system_program};
use anchor_spl::token;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};
use raydium_cp_swap::{
    cpi,
    program::RaydiumCpSwap,
    states::{AmmConfig, ObservationState, PoolState},
};

use crate::{FEE_WALLET1, FEE_WALLET2, FEE_WALLET3};

#[derive(Accounts)]
pub struct MultiBuy<'info> {
    pub cp_swap_program: Program<'info, RaydiumCpSwap>,
    pub payer: Signer<'info>,

    /// CHECK: the fee wallet 1 hardcoded
    #[account(
        mut,
        constraint = fee_wallet1.key() == Pubkey::from_str(FEE_WALLET1).unwrap()
    )]
    pub fee_wallet1: UncheckedAccount<'info>,

    /// CHECK: the fee wallet 2 hardcoded
    #[account(
        mut,
        constraint = fee_wallet2.key() == Pubkey::from_str(FEE_WALLET2).unwrap()
    )]
    pub fee_wallet2: UncheckedAccount<'info>,

    /// CHECK: the fee wallet 3 hardcoded
    #[account(
        mut,
        constraint = fee_wallet3.key() == Pubkey::from_str(FEE_WALLET3).unwrap()
    )]
    pub fee_wallet3: UncheckedAccount<'info>,

    /// CHECK: pool vault and lp mint authority
    #[account(
        seeds = [
            raydium_cp_swap::AUTH_SEED.as_bytes(),
        ],
        seeds::program = cp_swap_program,
        bump,
    )]
    pub authority: UncheckedAccount<'info>,

    #[account(address = pool_state_1.load()?.amm_config)]
    pub amm_config: Box<Account<'info, AmmConfig>>,

    #[account(mut)]
    pub wsol_account: Box<InterfaceAccount<'info, TokenAccount>>,
    pub token_program: Interface<'info, TokenInterface>,
    pub wsol_mint: Box<InterfaceAccount<'info, Mint>>,
    pub system_program: Program<'info, System>,

    // Per-token accounts (repeat for 12)
    #[account(mut)]
    pub pool_state_1: AccountLoader<'info, PoolState>,
    #[account(mut)]
    pub pool_state_2: AccountLoader<'info, PoolState>,
    #[account(mut)]
    pub pool_state_3: AccountLoader<'info, PoolState>,
    #[account(mut)]
    pub pool_state_4: AccountLoader<'info, PoolState>,
    #[account(mut)]
    pub pool_state_5: AccountLoader<'info, PoolState>,
    #[account(mut)]
    pub pool_state_6: AccountLoader<'info, PoolState>,
    #[account(mut)]
    pub pool_state_7: AccountLoader<'info, PoolState>,
    #[account(mut)]
    pub pool_state_8: AccountLoader<'info, PoolState>,
    #[account(mut)]
    pub pool_state_9: AccountLoader<'info, PoolState>,
    #[account(mut)]
    pub pool_state_10: AccountLoader<'info, PoolState>,
    #[account(mut)]
    pub pool_state_11: AccountLoader<'info, PoolState>,
    #[account(mut)]
    pub pool_state_12: AccountLoader<'info, PoolState>,

    #[account(mut)]
    pub output_token_account_1: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub output_token_account_2: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub output_token_account_3: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub output_token_account_4: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub output_token_account_5: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub output_token_account_6: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub output_token_account_7: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub output_token_account_8: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub output_token_account_9: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub output_token_account_10: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub output_token_account_11: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub output_token_account_12: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(mut)]
    pub input_vault_1: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub input_vault_2: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub input_vault_3: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub input_vault_4: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub input_vault_5: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub input_vault_6: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub input_vault_7: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub input_vault_8: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub input_vault_9: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub input_vault_10: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub input_vault_11: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub input_vault_12: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(mut)]
    pub output_vault_1: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub output_vault_2: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub output_vault_3: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub output_vault_4: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub output_vault_5: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub output_vault_6: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub output_vault_7: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub output_vault_8: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub output_vault_9: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub output_vault_10: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub output_vault_11: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub output_vault_12: Box<InterfaceAccount<'info, TokenAccount>>,

    pub output_token_mint_1: Box<InterfaceAccount<'info, Mint>>,
    pub output_token_mint_2: Box<InterfaceAccount<'info, Mint>>,
    pub output_token_mint_3: Box<InterfaceAccount<'info, Mint>>,
    pub output_token_mint_4: Box<InterfaceAccount<'info, Mint>>,
    pub output_token_mint_5: Box<InterfaceAccount<'info, Mint>>,
    pub output_token_mint_6: Box<InterfaceAccount<'info, Mint>>,
    pub output_token_mint_7: Box<InterfaceAccount<'info, Mint>>,
    pub output_token_mint_8: Box<InterfaceAccount<'info, Mint>>,
    pub output_token_mint_9: Box<InterfaceAccount<'info, Mint>>,
    pub output_token_mint_10: Box<InterfaceAccount<'info, Mint>>,
    pub output_token_mint_11: Box<InterfaceAccount<'info, Mint>>,
    pub output_token_mint_12: Box<InterfaceAccount<'info, Mint>>,

    #[account(mut)]
    pub observation_state_1: AccountLoader<'info, ObservationState>,
    #[account(mut)]
    pub observation_state_2: AccountLoader<'info, ObservationState>,
    #[account(mut)]
    pub observation_state_3: AccountLoader<'info, ObservationState>,
    #[account(mut)]
    pub observation_state_4: AccountLoader<'info, ObservationState>,
    #[account(mut)]
    pub observation_state_5: AccountLoader<'info, ObservationState>,
    #[account(mut)]
    pub observation_state_6: AccountLoader<'info, ObservationState>,
    #[account(mut)]
    pub observation_state_7: AccountLoader<'info, ObservationState>,
    #[account(mut)]
    pub observation_state_8: AccountLoader<'info, ObservationState>,
    #[account(mut)]
    pub observation_state_9: AccountLoader<'info, ObservationState>,
    #[account(mut)]
    pub observation_state_10: AccountLoader<'info, ObservationState>,
    #[account(mut)]
    pub observation_state_11: AccountLoader<'info, ObservationState>,
    #[account(mut)]
    pub observation_state_12: AccountLoader<'info, ObservationState>,
}

#[error_code]
pub enum CustomError {
    #[msg("token_length must be between 1 and 12")]
    InvalidTokenLength,
}

pub fn multi_buy(
    ctx: Context<MultiBuy>,
    amount_in: u64,
    minimum_amount_out: u64,
    token_length: u8,
) -> Result<()> {
    require!(token_length >= 1 && token_length <= 12, CustomError::InvalidTokenLength);

    // Arrays of references for easy indexed access
    let pool_states = [
        &ctx.accounts.pool_state_1,
        &ctx.accounts.pool_state_2,
        &ctx.accounts.pool_state_3,
        &ctx.accounts.pool_state_4,
        &ctx.accounts.pool_state_5,
        &ctx.accounts.pool_state_6,
        &ctx.accounts.pool_state_7,
        &ctx.accounts.pool_state_8,
        &ctx.accounts.pool_state_9,
        &ctx.accounts.pool_state_10,
        &ctx.accounts.pool_state_11,
        &ctx.accounts.pool_state_12,
    ];
    let output_token_accounts = [
        &ctx.accounts.output_token_account_1,
        &ctx.accounts.output_token_account_2,
        &ctx.accounts.output_token_account_3,
        &ctx.accounts.output_token_account_4,
        &ctx.accounts.output_token_account_5,
        &ctx.accounts.output_token_account_6,
        &ctx.accounts.output_token_account_7,
        &ctx.accounts.output_token_account_8,
        &ctx.accounts.output_token_account_9,
        &ctx.accounts.output_token_account_10,
        &ctx.accounts.output_token_account_11,
        &ctx.accounts.output_token_account_12,
    ];
    let input_vaults = [
        &ctx.accounts.input_vault_1,
        &ctx.accounts.input_vault_2,
        &ctx.accounts.input_vault_3,
        &ctx.accounts.input_vault_4,
        &ctx.accounts.input_vault_5,
        &ctx.accounts.input_vault_6,
        &ctx.accounts.input_vault_7,
        &ctx.accounts.input_vault_8,
        &ctx.accounts.input_vault_9,
        &ctx.accounts.input_vault_10,
        &ctx.accounts.input_vault_11,
        &ctx.accounts.input_vault_12,
    ];
    let output_vaults = [
        &ctx.accounts.output_vault_1,
        &ctx.accounts.output_vault_2,
        &ctx.accounts.output_vault_3,
        &ctx.accounts.output_vault_4,
        &ctx.accounts.output_vault_5,
        &ctx.accounts.output_vault_6,
        &ctx.accounts.output_vault_7,
        &ctx.accounts.output_vault_8,
        &ctx.accounts.output_vault_9,
        &ctx.accounts.output_vault_10,
        &ctx.accounts.output_vault_11,
        &ctx.accounts.output_vault_12,
    ];
    let output_token_mints = [
        &ctx.accounts.output_token_mint_1,
        &ctx.accounts.output_token_mint_2,
        &ctx.accounts.output_token_mint_3,
        &ctx.accounts.output_token_mint_4,
        &ctx.accounts.output_token_mint_5,
        &ctx.accounts.output_token_mint_6,
        &ctx.accounts.output_token_mint_7,
        &ctx.accounts.output_token_mint_8,
        &ctx.accounts.output_token_mint_9,
        &ctx.accounts.output_token_mint_10,
        &ctx.accounts.output_token_mint_11,
        &ctx.accounts.output_token_mint_12,
    ];
    let observation_states = [
        &ctx.accounts.observation_state_1,
        &ctx.accounts.observation_state_2,
        &ctx.accounts.observation_state_3,
        &ctx.accounts.observation_state_4,
        &ctx.accounts.observation_state_5,
        &ctx.accounts.observation_state_6,
        &ctx.accounts.observation_state_7,
        &ctx.accounts.observation_state_8,
        &ctx.accounts.observation_state_9,
        &ctx.accounts.observation_state_10,
        &ctx.accounts.observation_state_11,
        &ctx.accounts.observation_state_12,
    ];

    // Transfer SOL from payer to wsol_account
    system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.payer.to_account_info(),
                to: ctx.accounts.wsol_account.to_account_info(),
            },
        ),
        amount_in * token_length as u64,
    )?;

    // Sync native token
    token::sync_native(CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        token::SyncNative {
            account: ctx.accounts.wsol_account.to_account_info(),
        },
    ))?;

    for i in 0..(token_length as usize) {
        let cpi_accounts = cpi::accounts::Swap {
            payer: ctx.accounts.payer.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
            amm_config: ctx.accounts.amm_config.to_account_info(),
            pool_state: pool_states[i].to_account_info(),
            input_token_account: ctx.accounts.wsol_account.to_account_info(),
            output_token_account: output_token_accounts[i].to_account_info(),
            input_vault: input_vaults[i].to_account_info(),
            output_vault: output_vaults[i].to_account_info(),
            input_token_program: ctx.accounts.token_program.to_account_info(),
            output_token_program: ctx.accounts.token_program.to_account_info(),
            input_token_mint: ctx.accounts.wsol_mint.to_account_info(),
            output_token_mint: output_token_mints[i].to_account_info(),
            observation_state: observation_states[i].to_account_info(),
        };
        let cpi_context = CpiContext::new(ctx.accounts.cp_swap_program.to_account_info(), cpi_accounts);
        cpi::swap_base_input(cpi_context, amount_in, minimum_amount_out)?;
    }

    // Transfer fees as before, using total_amount = amount_in * token_length as u64
    let total_amount = amount_in * token_length as u64;
    system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.payer.to_account_info(),
                to: ctx.accounts.fee_wallet1.to_account_info(),
            },
        ),
        total_amount * 7 / 1000,
    )?;
    system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.payer.to_account_info(),
                to: ctx.accounts.fee_wallet2.to_account_info(),
            },
        ),
        total_amount * 4 / 1000,
    )?;
    system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.payer.to_account_info(),
                to: ctx.accounts.fee_wallet3.to_account_info(),
            },
        ),
        total_amount * 4 / 1000,
    )?;

    Ok(())
}