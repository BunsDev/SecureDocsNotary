// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {ERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";


error Unauthorized();
error AlreadyInitialized();

enum Visibility {
  Public,
  Private
}

struct Metadata {
  uint8 visibility;
  uint256 timestamp;
  bytes32 documentHash;
  bytes32[] keywords;
  string documentType;
  string uri;
  // QRCode qrcode; need to know how to implement this
}

contract SecureVault is ERC721Upgradeable, OwnableUpgradeable {
  uint256 public ptrTokenId;

  mapping(uint256 => Metadata) public metadata;

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
      _disableInitializers();
  }

  // @dev Initialize the contract with the provided parameters
  function initialize(
        address initialOwner
    ) external initializer {
        __ERC721_init("SecureVault", "SV");
        ptrTokenId = 1;
        _transferOwnership(initialOwner);
    }

  /// @dev Mint a new token with the provided metadata
  function mint(
    uint8 visibility,
    bytes32 documentHash,
    bytes32[] memory keywords,
    string memory documentType,
    string memory uri
  ) external onlyOwner {
    metadata[ptrTokenId] = Metadata({
      visibility: visibility,
      timestamp: block.timestamp,
      documentHash: documentHash,
      keywords: keywords,
      documentType: documentType,
      uri: uri
    });
    _mint(msg.sender, ptrTokenId);
    unchecked { ptrTokenId++; }
  }

  /// @dev Get the metadata of a token
  function getMetadata(uint256 tokenId) external view returns (Metadata memory) {
    return metadata[tokenId];
  }

  function name() public pure override returns (string memory) {
    return "SecureVault";
  }

  function symbol() public pure override returns (string memory) {
    return "SV";
  }

  /// @dev Get the token URI
  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    // if tokenID does not exist, return empty string
    return metadata[tokenId].uri;
  }

  /// @dev Override _update to prevent sending tokens to other addresses
  function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
    if (to != address(0) && auth != address(0)) {
      revert Unauthorized();
    }
    return super._update(to, tokenId, auth);
  }
}